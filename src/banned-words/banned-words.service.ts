import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannedWords } from './entities/banned-words.entity';
import { SafetyWords } from './entities/safety_words.entity';

@Injectable()
export class BannedWordsService {
  constructor(
    @InjectRepository(BannedWords)
    private readonly bannedWordsRepository: Repository<BannedWords>,
    @InjectRepository(SafetyWords)
    private readonly safetyWordsRepository: Repository<SafetyWords>,
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
          match_type: wordData.match_type,
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

  async seedSafetyWords(safety_words: any[]) {
    for (const wordData of safety_words) {
      const exists =
        await this.safetyWordsRepository.findOne({
          where: {
            safety_word: wordData.safety_word,
          },
        });

      // 既に存在するならスキップ
      if (exists) {
        continue;
      }

      // 新規保存
      const safetyWord =
        this.safetyWordsRepository.create({
          safety_word: wordData.safety_word,
        });

      await this.safetyWordsRepository.save(
        safetyWord,
      );
    }

    console.log(
      'Safetyワードseed完了',
    );
  }

  async replaceBannedWords(content: string): Promise<string> {
    let text = content.trim();

    console.log('置換前のテキスト:', text);
    // キーワードが空の場合は空文字列を返す
    if (text.length === 0) {
        return '';
    }

    // クエリビルダーを使用して、キーワードが banned_word に部分一致する禁止語を検索
    let bannedqueryBuilder = this.bannedWordsRepository
        .createQueryBuilder('bannedWord')
        .select(['bannedWord.banned_word', 'bannedWord.replace_text', 'bannedWord.match_type'])
        //.where(':text LIKE CONCAT(\'%\', bannedWord.banned_word, \'%\')', { text })
        .orderBy('LENGTH(bannedWord.banned_word)', 'DESC');

    let bannedWords = await bannedqueryBuilder.getMany();
    let safetyWords = await this.safetyWordsRepository.find();

    // 安全ワードを一時的にトークンに変換して避難させ、誤った変換を防止する
    const safetyWordMap = new Map<string, string>();
    safetyWords.forEach((safetyWord, index) => {
      const token = `__SAFE_TOKEN_${index}__`;
      safetyWordMap.set(token, safetyWord.safety_word);
      text = text.split(safetyWord.safety_word).join(token);
    });

    // 禁止語が見つからない場合は、元のテキストを返す
    if (!bannedWords.length) {
        return text;
    }

    let escapedBannedWord;
    let regex;
    let result = text;
    // 禁止語が見つかった場合は、テキスト内の禁止語を置換する
    for (const bannedWord of bannedWords) {
      text = result;
      switch (bannedWord.match_type) {
        case 'exact': // 完全一致(従来の方式)
          escapedBannedWord = bannedWord.banned_word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          regex = new RegExp(escapedBannedWord, 'gu');
          result = text.replace(regex, bannedWord.replace_text);
          if (result !== text) {
            console.log('完全一致')
          }
          break;
        case 'partial': // 部分一致
          escapedBannedWord = bannedWord.banned_word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          regex = new RegExp(`[${escapedBannedWord}]`, 'gu');
          result = text.replace(regex, bannedWord.replace_text);
          if (result !== text) {
            console.log('部分一致')
          }
          break;
        case 'strict': // 前後含み判定
          escapedBannedWord = bannedWord.banned_word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          regex = new RegExp(`(?<=^|\\s|[\\u3000-\\u303F])${escapedBannedWord}(?=\\s|[\\u3000-\\u303F]|$)`, 'gu');
          result = text.replace(regex, `$1${bannedWord.replace_text}$2`);
          if (result !== text) {
            console.log('厳密一致')
          }
          break;
        case 'regex': // 正規表現
          regex = new RegExp(bannedWord.banned_word, 'gu');
          result = text.replace(regex, bannedWord.replace_text);
          if (result !== text) {
            console.log('正規表現')
          }
          break;
        default:
          console.warn(`未知のマッチタイプ: ${bannedWord.match_type}`);
          break;
      }
    }

    // 避難させていた安全ワードを元のテキストに戻す
    safetyWordMap.forEach((originalWord, token) => {
      result = result.split(token).join(originalWord);
    });

    return result;
  }
}