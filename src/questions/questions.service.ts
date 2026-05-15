import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questions } from './entities/questions.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
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
        const userId = 'a4887349-4616-4473-88ca-e41e108d00c3'; // 仮のユーザーID
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
};