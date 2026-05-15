import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswerService } from './answers.service';

// requestからユーザーIDと質問IDを取得するインターフェース
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  }
  question: {
    questionId: string;
  }
}

// 回答データのCRUD(作成、取得)を行うコントローラー
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

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

  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(createAnswerDto);
  }

  // 仮の回答データ作成
  @Post('seed')
  seed() {
    return this.answerService.seed();
  }
}