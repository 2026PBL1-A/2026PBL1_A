import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BannedWord } from './entities/banned_word.entity';

import { BannedWordService } from './banned_word.service';
import { BannedWordController } from './banned_word.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BannedWord,
    ]),
  ],
  providers: [BannedWordService],
  controllers: [BannedWordController],
  exports: [BannedWordService],
})
export class BannedWordModule {}