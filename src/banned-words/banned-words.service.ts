import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BannedWords } from './entities/banned-words.entity';

@Injectable()
export class BannedWordsService {
  constructor(
    @InjectRepository(BannedWords)
    private readonly bannedWordsRepository: Repository<BannedWords>,
  ) {}

  async seedBannedWords(banned_word: any[]) {
    for (const wordData of banned_word) {
      const exists =
        await this.bannedWordsRepository.findOne({
          where: {
            banned_word: wordData.banned_word,
          },
        });

      // 既に存在するならスキップ
      if (exists) {
        continue;
      }

      // 新規保存
      const bannedWord =
        this.bannedWordsRepository.create({
          banned_word: wordData.banned_word,
          replace_text: wordData.replace_text,
          is_active: true,
        });

      await this.bannedWordsRepository.save(
        bannedWord,
      );
    }

    console.log(
      'NGワードseed完了',
    );
  }
}