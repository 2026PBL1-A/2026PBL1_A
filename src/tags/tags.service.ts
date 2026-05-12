import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tags.entity';
import { CreateTagDto } from './dto/create-tag.dto';


@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    // タグの新規作成
    async create(dto: CreateTagDto): Promise<Tag> {
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
    async findAll(): Promise<Tag[]> {
        return this.tagRepository.find({
            order: { tag: 'ASC' },
        });
    }

    // タグをIDで取得
    async findByIds(ids: string[]): Promise<Tag[]> {
        if (!ids?.length) return [];

        return this.tagRepository.findBy({
            id: In(ids),
        });
    }

    // タグを1件取得
    async findOne(id: string): Promise<Tag | null> {
        return this.tagRepository.findOne({
            where: { id },
        });
    }

    // タグ名で検索
    async findByName(tag: string): Promise<Tag | null> {
        return this.tagRepository.findOne({
            where: { tag },
        });
    }
}
