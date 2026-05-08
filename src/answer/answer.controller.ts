import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswerService } from './answer.service';

// 回答データのCRUD(作成、取得)を行うコントローラー

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 質問IDに基づいて全ての回答
  // データの取得
  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.answerService.findAll(id);
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