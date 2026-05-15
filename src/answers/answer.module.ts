import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerService } from './answers.service';
import { AnswerController } from './answers.controller';
import { Answer } from './entities/answers.entity';
import { Questions } from '../questions/entities/questions.entity';
import { User } from '../user/entities/user.entity';

// Answer機能のDI設定をまとめるモジュール
@Module({
  // AnswerエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Answer, Questions, User])],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}