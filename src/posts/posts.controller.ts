import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {//userIdを取得するためのインターフェース
    user: { userId: string };
}

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('seed')//仮データ
    seed() {
        return this.postsService.seed();
    }

    @UseGuards(JwtAuthGuard)
    @Post()//新規作成
    create(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreatePostDto,
    ) {
        const userId = req.user.userId;
        return this.postsService.createPost(dto, userId);
    }

    @Get()//全件取得
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':id')//指定した投稿を取得
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }
}