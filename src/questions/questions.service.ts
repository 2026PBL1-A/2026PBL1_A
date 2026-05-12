import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
};