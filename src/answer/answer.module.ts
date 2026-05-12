import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer } from './entities/answer.entity';
import { Questions } from '../questions/entities/questions.entity';
import { User } from '../user/entities/user.entity';
import { AnswerScore } from './entities/answerScore.entity';

// Answer機能のDI設定をまとめるモジュール
@Module({
  // AnswerエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Answer, Questions, User, AnswerScore])],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}