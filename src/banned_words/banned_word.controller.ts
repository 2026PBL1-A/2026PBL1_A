import { Controller, Post, Body, Req, Get, Param, Query, Patch } from '@nestjs/common';
import { Request } from 'express';
import { BannedWordService } from './banned_word.service';

interface AuthenticatedRequest extends Request {//userIdを取得するためのインターフェース
    user: { userId: string };
}

@Controller('banned-words')
export class BannedWordController {
    constructor(private readonly bannedWordService: BannedWordService) {}

    @Patch('replace')
    async replaceBannedWords(@Body('content') content: string): Promise<{ replacedContent: string }> {
        const replacedContent = await this.bannedWordService.replaceBannedWords(content);
        return { replacedContent };
    }
}