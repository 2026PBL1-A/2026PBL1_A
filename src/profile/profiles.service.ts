import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profiles.dto';
import { Profile } from './entities/profiles.entity';
import { NotFoundException } from '@nestjs/common';

//profileテーブルに対するデータ操作を担当するサービス(userテーブルのServiceから呼び出される)
@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ) {}

    // DTOをProfileエンティティに変換し、DBへ保存する（バリデーション後のデータを永続化）
    async create(createProfileDto: CreateProfileDto, userId: string) {
        if (!userId) {
            throw new NotFoundException('User not found');
        }

        const profile = this.profileRepository.create({
            user_id: userId,
            bio: createProfileDto.bio,
            tag: createProfileDto.tag,
            avatarUrl: createProfileDto.avatarUrl,
        });

        return this.profileRepository.save(profile);
    }

    // すべてのプロフィールを取得する
    async findAll() {
        return this.profileRepository.find();
    }

    // IDで1件取得する
    async findOne(id: string) {
        return this.profileRepository.findOneBy({ id });
    }
    
}