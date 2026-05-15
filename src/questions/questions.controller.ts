import { Controller, Post, Get, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { Request } from 'express';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: { userId: string };
    keyword: {keyword: string};
}

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Get('seed')//仮データ
    seed() {
        return this.questionsService.seed();
    }

    @UseGuards(JwtAuthGuard)
    @Post()//新規作成
    create(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateQuestionDto,
    ) {
        const userId = req.user.userId;
        return this.questionsService.createQuestion(dto, userId);
    }

    @Get()//全件取得
    findAll(@Query('tag_ids') tagIds?: string) {
        const tagIdArray = tagIds ? tagIds.split(',').map((id) => id.trim()).filter(Boolean) : [];
        return this.questionsService.findAll(tagIdArray);
    }

    @Get('search')//キーワードで質問を検索
    searchQuestionsByKeyword(@Query('keyword') keyword: string) {
        return this.questionsService.searchQuestionsByKeyword(keyword);
    }
    
    @Get(':id')//指定した質問を取得
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(id);
    }


}