import { Controller, Get } from '@nestjs/common';

import { BannedWordsService } from './banned-words.service';

@Controller('banned-words')
export class BannedWordsController {
  constructor(
    private readonly bannedWordsService:
      BannedWordsService,
  ) {}
}