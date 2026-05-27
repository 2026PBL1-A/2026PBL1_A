import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateAnswerDto} from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answers } from './entities/answers.entity';
import { Users } from '../users/entities/users.entity';
import { Questions } from '../questions/entities/questions.entity';
import { AnswerScores } from '../answer-scores/entities/answer-scores.entity';

//answerテーブルに対するデータ操作を担当するサービス
@Injectable()
export class AnswersService {
    constructor(
        @InjectRepository(Answers)
        private readonly answerRepository: Repository<Answers>,
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Questions)
        private readonly questionRepository: Repository<Questions>,
        @InjectRepository(AnswerScores)
        private readonly answerScoreRepository: Repository<AnswerScores>,
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

    // 回答のスコアを取得する
    async getScore(answerId: string) {
        const score = await this.answerScoreRepository.findOneBy({ answerId: answerId });
        return score;
    }

    // scoreを更新する
    async updateScore(answerId: string, userId: string) {
        if (!answerId || !userId) {
            throw new Error('回答IDとユーザーIDが指定されていません');
        }
        const answerScore = await this.answerScoreRepository.findOneBy({ answerId: answerId, userId: userId });
        if (answerScore) {  // 既にスコアが存在する場合は削除して0にする
            return this.answerScoreRepository.delete({ answerId: answerId, userId: userId });
        }
        else {  // スコアが存在しない場合は新規作成して1にする
            return this.answerScoreRepository.save({ answerId: answerId, userId: userId });
        }
    }

    // 指定IDの回答情報を更新し、その後最新の状態を取得して返す
    async update(id: string, updateAnswerDto: UpdateAnswerDto) {
        if (!id) {
            throw new Error('回答IDが必要です');
        }
        
        const question = await this.questionRepository.findOneBy({ id: updateAnswerDto.questionId });
        const user = await this.userRepository.findOneBy({ id: updateAnswerDto.userId });
        if (!question || !user) {
            throw new Error('指定された質問またはユーザーが存在しません');
        }

        const updateAnswer = await this.answerRepository.findOneBy({ id: id });
        if (!updateAnswer) {
            throw new Error('指定された回答が見つかりません');
        }

        updateAnswer.comment = updateAnswerDto.comment;
        await this.answerRepository.save(updateAnswer);
        return await this.answerRepository.findOneBy({ id: id });
    }

    // 指定IDの回答を削除する
    async remove(id: string) {
        return await this.answerRepository.delete(id);
    }

    // 回答のシードデータを作成する
    async seed() {
        const users = await this.userRepository.find({ take: 2 });
        const questions = await this.questionRepository.find({ take: 2 });

        if (users.length === 0 || questions.length === 0) {
            throw new Error('User または Question のデータが存在しないため、先に作ってください。');
        }

        const sampleanswer: DeepPartial<Answers>[] = [
            { comment: 'これは質問1のサンプル回答1です', questionId: { id: questions[0].id }, userId: { id: users[0].id }},
            { comment: 'これは質問1のサンプル回答2です', questionId: { id: questions[0].id }, userId: { id: users[1].id }},
            { comment: 'これは質問2のサンプル回答1です', questionId: { id: questions[1].id }, userId: { id: users[0].id }},
        ];
        return this.answerRepository.save(sampleanswer);
    }
    
}