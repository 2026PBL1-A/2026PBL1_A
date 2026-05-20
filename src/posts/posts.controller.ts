import { Controller, Post, Body, Req, UseGuards, Get, Param, Query, Patch } from '@nestjs/common';
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
    findAll(@Query('tag_ids') tagIds?: string) {
        const tagIdArray = tagIds ? tagIds.split(',').map((id) => id.trim()).filter(Boolean) : [];
        return this.postsService.findAll(tagIdArray);
    }

    @Get('search')//文字列検索（タイトル・本文・タグ名）
    search(@Query('keyword') keyword?: string) {
        return this.postsService.searchPosts(keyword ?? '');
    }

    @Get(':id')//指定した投稿を取得
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')//投稿を更新
    update(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreatePostDto,
    ) {
        const userId = req.user.userId;
        return this.postsService.updatePost(id, dto, userId);
    }
}