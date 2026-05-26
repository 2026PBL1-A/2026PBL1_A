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

  async replaceBannedWords(content: string): Promise<string> {
    let text = content.trim();

    // キーワードが空の場合は空文字列を返す
    if (text.length === 0) {
        return '';
    }

    // クエリビルダーを使用して、キーワードが banned_word に部分一致する禁止語を検索
    let queryBuilder = this.bannedWordsRepository
        .createQueryBuilder('bannedWord')
        .select(['bannedWord.banned_word', 'bannedWord.replace_text'])
        .where(':text LIKE CONCAT(\'%\', bannedWord.banned_word, \'%\')', { text })
        .orderBy('LENGTH(bannedWord.banned_word)', 'DESC');

    let bannedWords = await queryBuilder.getMany();

    // 禁止語が見つからない場合は、元のテキストを返す
    if (!bannedWords.length) {
        return text;
    }

    let escapedBannedWord;
    let regex;
    // 禁止語が見つかった場合は、テキスト内の禁止語を置換する
    for (const bannedWord of bannedWords) {
        escapedBannedWord = bannedWord.banned_word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        regex = new RegExp(escapedBannedWord, 'g');
        text = text.replace(regex, bannedWord.replace_text);
    }

    return text;
  }
}