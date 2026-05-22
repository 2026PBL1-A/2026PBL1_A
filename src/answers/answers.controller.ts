import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { AnswersService } from './answers.service';

// requestからユーザーIDと質問IDを取得するインターフェース
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  }
  question: {
    questionId: string;
  }
  answer: {
    answerId: string;
  }
}

// 回答データのCRUD(作成、取得)を行うコントローラー
@Controller('answers')
export class AnswersController {
  constructor(private readonly answerService: AnswersService) {}

  // 質問IDに基づいて全ての回答
  // データの取得
  @Get('question/:questionId')
  findByQuestionId(@Param('questionId') questionId: string) {
    return this.answerService.findByQuestionId(questionId);
  }

  // 回答のidを指定してデータ取得
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(id);
  }

  // 回答のスコアを取得  
  @Get('score/:answerId')
  getScore(@Param('answerId') answerId: string) {
    return this.answerService.getScore(answerId);
  }

  @Patch('update/:id')
    update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
      return this.answerService.update(id, updateAnswerDto);
    }

  // 回答の作成
  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(createAnswerDto);
  }

  // 回答のスコアを更新
  @Post('score/:answerId/:userId')
  updateScore(@Param('answerId') answerId: string, @Param('userId') userId: string) {
    return this.answerService.updateScore(answerId, userId);
  }

  // 回答の削除
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.answerService.remove(id);
  }

  // 仮の回答データ作成
  @Post('seed')
  seed() {
    return this.answerService.seed();
  }
}