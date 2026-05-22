import { Controller, Post, Patch, Get, Param, Req, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowsService } from './follows.service';

interface AuthenticatedRequest extends Request {
    user: { userId: string };
}

@Controller('follows')
export class FollowsController {
    constructor(private readonly followsService: FollowsService) {}

    @UseGuards(JwtAuthGuard)
    @Patch(':followerId')
    create(@Param('followerId')id: string, @Req() req: AuthenticatedRequest) {
        const followerId = id;
        const followingId = req.user.userId;
        return this.followsService.create(followingId, followerId);
    }
    
    // フォロワー取得
    @Get('followers/:userId')
    getFollowers(@Param('userId') userId: string) {
        return this.followsService.getFollowers(userId);
    }

    // フォロー中取得
    @Get('following/:userId')
    getFollowing(@Param('userId') userId: string) {
        return this.followsService.getFollowing(userId);
    }
}