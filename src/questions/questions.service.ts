import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Questions } from './entities/questions.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionTags } from '../question-tags/entities/question-tags.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Questions)
        private questionsRepository: Repository<Questions>,
        @InjectRepository(QuestionTags)
        private questionTagsRepository: Repository<QuestionTags>,
    ) {}

    async seed() {
        const userId = '95f421e2-78f3-4b54-be5c-fab014e64f32'; // 仮のユーザーID
        const samples: CreateQuestionDto[] = [
            {
                title: 'first Question',
                content: 'This is the first question.'
            },
            {
                title: 'second Question',
                content: 'This is the second question.'
                },
            ];
        const questions = samples.map(sample =>
            this.questionsRepository.create({
                user_id: userId,
                ...sample,
            })
        );
        return this.questionsRepository.save(questions);
    }

//新規作成
    async createQuestion(createQuestionDto: CreateQuestionDto, userId: string): Promise<Questions> {
        const question = this.questionsRepository.create({
            user_id: userId,
            title: createQuestionDto.title,
            content: createQuestionDto.content,
        });
        const savedQuestion = await this.questionsRepository.save(question);

        if (createQuestionDto.tag_ids && createQuestionDto.tag_ids.length > 0) {
            const questionTags = createQuestionDto.tag_ids.map((tag_id) =>
                this.questionTagsRepository.create({
                    question_id: savedQuestion.id,
                    tag_id,
                })
            );
            await this.questionTagsRepository.save(questionTags);
        }

        return savedQuestion;
    }

    // 質問更新
    async update(id: string, userId: string, updateQuestionDto: UpdateQuestionDto): Promise<Questions> {
        // 質問の存在確認
        const question = await this.questionsRepository.findOneBy({ id });
        if (!question) {
            throw new NotFoundException('質問が見つかりません');
        }

        // 質問の所有者確認
        if (question.user_id !== userId) {
            throw new ForbiddenException('権限がありません');
        }

        // 部分更新に対応
        if (updateQuestionDto.title !== undefined) {
            question.title = updateQuestionDto.title;
        }
        if (updateQuestionDto.content !== undefined) {
            question.content = updateQuestionDto.content;
        }

        const savedQuestion = await this.questionsRepository.save(question);

        // タグ更新処理: tag_ids が指定されていれば既存タグを削除して再登録
        if (updateQuestionDto.tag_ids !== undefined) {
            // 既存の中間テーブルを削除
            await this.questionTagsRepository.delete({ question_id: id });

            if (updateQuestionDto.tag_ids && updateQuestionDto.tag_ids.length > 0) {
                const questionTags = updateQuestionDto.tag_ids.map((tag_id) =>
                    this.questionTagsRepository.create({
                        question_id: savedQuestion.id,
                        tag_id,
                    }),
                );
                await this.questionTagsRepository.save(questionTags);
            }
        }

        // relations を含めて返す
        return this.findOne(savedQuestion.id);
    }

//全件取得（オプション: タグで絞り込み可能）
    async findAll(tagIds: string[] = []): Promise<Questions[]> {
        // 重複排除と空文字列をフィルタリング
        const uniqueTagIds = [...new Set(tagIds.filter(Boolean))];

        // タグ指定なし: 全質問をタグ情報付きで返す（降順）
        if (!uniqueTagIds.length) {
            return this.questionsRepository.find({
                order: { created_at: 'DESC' },
                relations: {
                    questionTags: {
                        tag: true,
                    },
                },
            });
        }

        // 指定タグを「いずれか1つでも含む」質問IDをサブクエリで抽出
        const subQuery = this.questionsRepository
            .createQueryBuilder('filteredQuestion')         // サブクエリのエイリアスを `filteredQuestion` に変更
            .select('DISTINCT filteredQuestion.id')         // 重複排除し、質問IDだけ取得
            .innerJoin('filteredQuestion.questionTags', 'filteredQuestionTag')      // 質問とタグの中間テーブルを結合
            .where('filteredQuestionTag.tag_id IN (:...tagIds)', { tagIds: uniqueTagIds });     // 指定タグのいずれかを持つ質問を抽出

        // サブクエリの質問をすべて取得し、タグ情報も結合（降順）
        return this.questionsRepository
            .createQueryBuilder('question')     // 質問のエイリアスを `question` に変更
            .leftJoinAndSelect('question.questionTags', 'questionTag')      // 質問とタグの中間テーブルを結合してタグIDを取得
            .leftJoinAndSelect('questionTag.tag', 'tag')        // タグの詳細情報も結合
            .where(`question.id IN (${subQuery.getQuery()})`)       // サブクエリで抽出された質問IDをもとに質問を取得
            .setParameters(subQuery.getParameters())        // サブクエリのパラメータを引き継ぐ
            .orderBy('question.created_at', 'DESC')     // 作成日時の降順でソート
            .getMany();     // 結果を取得
    }

//ID取得
    async findOne(id: string): Promise<Questions > {
        const question = await this.questionsRepository.findOne({
            where: { id },
            relations: {
                questionTags: {
                    tag: true,
                },
            },
        });
        if (!question) {
            throw new NotFoundException('質問が見つかりません');
        }
        return question;
    }

//キーワードで質問を検索して結果を取得
    async searchQuestionsByKeyword(keyword: string): Promise<Questions[]> {
        // キーワードをスペースで分割して複数のキーワードを処理。単体でも大丈夫
        const keywords: string[] = keyword.split(/[\s　]+/);
        const keywordslength = keywords.length;
        
        // キーワードが空の場合は空の配列を返す
        if (keywordslength === 0) {
            return [];
        }
        
        const queryBuilder = this.questionsRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.questionTags', 'questionTag')
            .leftJoinAndSelect('questionTag.tag', 'tag');
        
        // キーワードごとに動的にwhere追加してインジェクション対策
        keywords.forEach((kw, index) => {
            // パラメータ名が重複しないようにindexを付与。例:keyword0, keyword1
            const paramName = `keyword${index}`;
            const condition = new Brackets((qb) => {
                qb.where(`question.title LIKE :${paramName}`, { [paramName]: `%${kw}%` })
                .orWhere(`question.content LIKE :${paramName}`, { [paramName]: `%${kw}%` })
                .orWhere(`tag.tag LIKE :${paramName}`, { [paramName]: `%${kw}%` });
            });
            if (index === 0) {
                queryBuilder.where(condition);
            } 
            else {
                queryBuilder.andWhere(condition);
            }
        });

        return queryBuilder
        .orderBy('question.created_at', 'DESC')
        .getMany();
        // // キーワードがスペースを含まない場合は、そのキーワードでそのまま検索
        // else {
        //     return this.questionsRepository
        //         .createQueryBuilder('question')
        //         // questionとquestionTag、questionTagとtagを結合
        //         .leftJoinAndSelect('question.questionTags', 'questionTag')
        //         .leftJoinAndSelect('questionTag.tag', 'tag')
        //         // タイトル、内容、タグ名にキーワードが含まれる質問を検索
        //         .where('question.title LIKE :keyword OR question.content LIKE :keyword OR tag.tag LIKE :keyword', { keyword: `%${keyword}%` })
        //         .orderBy('question.created_at', 'DESC')
        //         .getMany();
        // }
    
    }
};