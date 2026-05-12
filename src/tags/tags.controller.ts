import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tags.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

    // タグの新規作成
    // POST /tags
    @Post()
    async create(@Body() dto: CreateTagDto): Promise<Tag> {
        return this.tagsService.create(dto);
    }

    // 全てのタグを取得
    // GET /tags
    @Get()
    async findAll(): Promise<Tag[]> {
        return this.tagsService.findAll();
    }

    // タグをIDで取得
    // GET /tags/ids?ids=uuid1,uuid2,uuid3
    @Get('ids')
    async findByIds(@Query('ids') ids: string): Promise<Tag[]> {
        const idArray = ids ? ids.split(',').map((id) => id.trim()).filter(Boolean) : [];
        return this.tagsService.findByIds(idArray);
    }

    // タグ名で検索
    // GET /tags/search?tag=tagName
    @Get('search')
    async findByName(@Query('tag') tag: string): Promise<Tag | null> {
        return this.tagsService.findByName(tag);
    }

    // タグを1件取得
    // GET /tags/:id
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Tag | null> {
        return this.tagsService.findOne(id);
    }
}