import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tags } from './entities/tags.entity';
import { CreateTagDto } from './dto/create-tag.dto';


@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tags)
        private readonly tagRepository: Repository<Tags>,
    ) {}

    // タグの新規作成
    async create(dto: CreateTagDto): Promise<Tags> {
        const existing = await this.findByName(dto.tag);
        if (existing) {
            return existing;
        }
        const tag = this.tagRepository.create({
            tag: dto.tag,
        });
        return this.tagRepository.save(tag);
    }

    // 全てのタグを取得
    async findAll(): Promise<Tags[]> {
        return this.tagRepository.find({
            order: { tag: 'ASC' },
        });
    }

    // タグをIDで取得
    async findByIds(ids: string[]): Promise<Tags[]> {
        if (!ids?.length) return [];

        return this.tagRepository.findBy({
            id: In(ids),
        });
    }

    // タグを1件取得
    async findOne(id: string): Promise<Tags | null> {
        return this.tagRepository.findOne({
            where: { id },
        });
    }

    // タグ名で検索
    async findByName(tag: string): Promise<Tags | null> {
        return this.tagRepository.findOne({
            where: { tag },
        });
    }

    // 開発・テスト用にサンプルタグデータをDBへ登録する
    async seed(): Promise<Tags[]> {
        const samples: CreateTagDto[] = [
            { tag: 'TypeScript' },
            { tag: 'エラー修正' },
            { tag: 'mysql' },
        ];

        const tags: Tags[] = [];
        for (const sample of samples) {
            tags.push(await this.create(sample));
        }

        return tags;
    }
}
