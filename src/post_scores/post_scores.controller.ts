import { Controller, Post, Get, Param, Req, UseGuards, } from '@nestjs/common';
import type { Request } from 'express';
import { PostScoresService } from './post_scores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('post-scores')
export class PostScoresController {

    constructor(
        private readonly postScoresService: PostScoresService,
    ) {}

    // いいね切り替え
    @UseGuards(JwtAuthGuard)
    @Post(':postId')
    toggleScore(
        @Param('postId') postId: string,
        @Req() req: Request,
    ) {

        const user = req.user as any;

        return this.postScoresService.toggleScore(
            postId,
            user.id,
        );
    }

    // スコア取得
    @Get(':postId')
    getScore(
        @Param('postId') postId: string,
    ) {

        return this.postScoresService.getScore(postId);
    }
}