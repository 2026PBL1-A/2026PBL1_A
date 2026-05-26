import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BannedWords } from './entities/banned-words.entity';
import { BannedWordsService } from './banned-words.service';
import { BannedWordsController } from './banned-words.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BannedWords,
    ]),
  ],
  controllers: [
    BannedWordsController,
  ],
  providers: [
    BannedWordsService,
  ],
  exports: [
    BannedWordsService,
  ],
})
export class BannedWordsModule {}