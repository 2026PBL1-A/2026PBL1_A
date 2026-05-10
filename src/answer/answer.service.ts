import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateAnswerDto} from './dto/create-answer.dto';
import { Answer } from './entities/answer.entity';
import { User } from '../user/entities/user.entity';
import { Questions } from '../questions/entities/questions.entity';

//answerテーブルに対するデータ操作を担当するサービス
@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Questions)
        private readonly questionRepository: Repository<Questions>,
    ) {}

    // DTOをAnswerエンティティに変換し、DBへ保存する（バリデーション後のデータを永続化）
    async create(createAnswerDto: CreateAnswerDto) {
        const question = await this.questionRepository.findOneBy({ id: createAnswerDto.questionId });
        const user = await this.userRepository.findOneBy({ id: createAnswerDto.userId });

        if (!question || !user) {
            throw new Error('指定された質問IDまたはユーザーIDが存在しません');
        }

        const answer = this.answerRepository.create({ comment: createAnswerDto.comment, questionId: question, userId: user  });
        return await this.answerRepository.save(answer);
    }

    // 質問IDに基づいて全ての回答を取得する
    async findByQuestionId(questionId: string) {
        return this.answerRepository.find({ 
            relations: { 
                questionId: true, 
                userId: true 
            },
            where: { 
                questionId: { 
                    id: questionId 
                }
            },
            order: {
                created_at: 'ASC'
            }
        });
    }

    // 回答IDで1件取得する
    async findOne(id: string) {
        return this.answerRepository.findOneBy({ id });
    }

    // 必要なら。指定IDの回答情報を更新し、その後最新の状態を取得して返す
    /*async update(id: string, updateAnswerDto: CreateAnswerDto) {
        await this.answerRepository.update(id, updateAnswerDto);
        return this.findOne(id);
    }*/

    // 必要なら。指定IDの回答を削除する
    /*async remove(id: string) {
        await this.answerRepository.delete(id);
    }*/

    // 回答のシードデータを作成する
    async seed() {
        const users = await this.userRepository.find({ take: 2 });
        const questions = await this.questionRepository.find({ take: 2 });

        if (users.length === 0 || questions.length === 0) {
            throw new Error('User または Question のデータが存在しないため、先に作ってください。');
        }

        const sampleanswer: DeepPartial<Answer>[] = [
            { comment: 'これは質問1のサンプル回答1です', questionId: { id: questions[0].id }, userId: { id: users[0].id }, score: 1 },
            { comment: 'これは質問1のサンプル回答2です', questionId: { id: questions[0].id }, userId: { id: users[1].id }, score: 2 },
            { comment: 'これは質問2のサンプル回答1です', questionId: { id: questions[1].id }, userId: { id: users[0].id }, score: 3 },
        ];
        return this.answerRepository.save(sampleanswer);
    }
    
}