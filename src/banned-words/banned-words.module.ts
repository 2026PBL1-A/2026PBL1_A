import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BannedWords } from './entities/banned-words.entity';
import { SafetyWords } from './entities/safety_words.entity';
import { BannedWordsService } from './banned-words.service';
import { BannedWordsController } from './banned-words.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BannedWords,
      SafetyWords,
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