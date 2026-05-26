import { Controller, Patch, Body } from '@nestjs/common';

import { BannedWordsService } from './banned-words.service';

@Controller('banned-words')
export class BannedWordsController {
  constructor(
    private readonly bannedWordsService:
      BannedWordsService,
  ) {}

  @Patch('replace')
      async replaceBannedWords(@Body('content') content: string): Promise<{ replacedContent: string }> {
          const replacedContent = await this.bannedWordsService.replaceBannedWords(content);
          return { replacedContent };
      }
}