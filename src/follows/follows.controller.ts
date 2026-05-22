import { Controller, Post, Get, Param, Req, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowsService } from './follows.service';

interface AuthenticatedRequest extends Request {
    user: { userId: string };
    postId: {postId: string};
}

@Controller('follows')
export class FollowsController {
    constructor(
        private readonly FollowsService: FollowsService,
    ) {}


}