import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { Answers } from './entities/answers.entity';
import { Questions } from '../questions/entities/questions.entity';
import { Users } from '../users/entities/users.entity';

// Answer機能のDI設定をまとめるモジュール
@Module({
  // AnswerエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Answers, Questions, Users])],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}