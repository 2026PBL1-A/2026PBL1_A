import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questions } from './entities/questions.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Questions)
        private questionsRepository: Repository<Questions>,
    ) {}

    async seed() {
        const userId = 'a4887349-4616-4473-88ca-e41e108d00c3'; // 仮のユーザーID
        const samples: CreateQuestionDto[] = [
            {
                title: 'first Question',
                content: 'This is the first question.',
                tag: 'sample'
            },
            {
                title: 'second Question',
                content: 'This is the second question.',
                tag: 'sample2'
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
            ...createQuestionDto,
        });
        return await this.questionsRepository.save(question);
    }
    
//全件取得
    async findAll(): Promise<Questions[]> {
        return this.questionsRepository.find({
            order: { created_at: 'DESC' },
        });
    }

//ID取得
    async findOne(id: string): Promise<Questions > {
        const question = await this.questionsRepository.findOneBy({ id });
        if (!question) {
            throw new NotFoundException('質問が見つかりません');
        }
        return question;
    }
};