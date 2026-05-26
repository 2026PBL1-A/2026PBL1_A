import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannedWord } from './entities/banned_word.entity';

@Injectable()
export class BannedWordService {
    constructor(
        @InjectRepository(BannedWord)
        private bannedWordRepository: Repository<BannedWord>,
    ) {}

    async replaceBannedWords(content: string): Promise<string> {
        let text = content.trim();

        // キーワードが空の場合は空文字列を返す
        if (text.length === 0) {
            return '';
        }

        // クエリビルダーを使用して、キーワードが banned_word に部分一致する禁止語を検索
        let queryBuilder = this.bannedWordRepository
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