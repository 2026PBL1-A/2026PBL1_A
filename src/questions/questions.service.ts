import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Questions } from './entities/questions.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionTag } from '../question-tags/entities/question-tags.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Questions)
        private questionsRepository: Repository<Questions>,
        @InjectRepository(QuestionTag)
        private questionTagRepository: Repository<QuestionTag>,
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
                this.questionTagRepository.create({
                    question_id: savedQuestion.id,
                    tag_id,
                })
            );
            await this.questionTagRepository.save(questionTags);
        }

        return savedQuestion;
    }
    
//全件取得
    async findAll(): Promise<Questions[]> {
        return this.questionsRepository.find({
            order: { created_at: 'DESC' },
            relations: {
                questionTags: {
                    tag: true,
                },
            },
        });
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