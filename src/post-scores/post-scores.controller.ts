import { Controller, Post, Get, Param, Req, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import type { Request } from 'express';
import { PostScoresService } from './post-scores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: { userId: string };
    postId: {postId: string};
}

@Controller('post-scores')
export class PostScoresController {
    constructor(
        private readonly postScoresService: PostScoresService,
    ) {}

    // いいね切り替え
    @UseGuards(JwtAuthGuard)
    @Post(':postId')
    async toggleScore(
        @Param('postId', new ParseUUIDPipe()) postId: string,
        @Req() req: AuthenticatedRequest,
    )  {
        return await this.postScoresService.toggleScore(
            postId,
            req.user.userId
        );
    }

    // スコア取得
    @Get(':postId')
    async getScore(
        @Param('postId', new ParseUUIDPipe()) postId: string,
    ) {

        return await this.postScoresService.getScore(postId);
    }
}