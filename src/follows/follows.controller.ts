import { Controller, Post, Patch, Get, Param, Req, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowsService } from './follows.service';

interface AuthenticatedRequest extends Request {
    user: { userId: string };
}

@Controller('follows')
export class FollowsController {
    constructor(
        private readonly FollowsService: FollowsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Patch(':followerId')
    create(@Param('followerId')id: string, @Req() req: AuthenticatedRequest) {
        const followerId = id;
        const followingId = req.user.userId;
        return this.FollowsService.create(followingId, followerId);
    }
    
}