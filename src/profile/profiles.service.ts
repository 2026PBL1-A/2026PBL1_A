import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profiles.dto';
import { Profile } from './entities/profiles.entity';
import { User } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

//profileテーブルに対するデータ操作を担当するサービス
@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // DTOをProfileエンティティに変換し、DBへ保存する（バリデーション後のデータを永続化）
    async create(createProfileDto: CreateProfileDto) {
        const users = await this.userRepository.query(
            'SELECT username FROM USERS WHERE id = ? LIMIT 1',
            [createProfileDto.userId],
        );

        if (!users.length) {
            throw new NotFoundException('User not found');
        }

        const username = users[0].username as string;

        const profile = this.profileRepository.create({
            user_id: { id: createProfileDto.userId } as User,
            username,
            bio: createProfileDto.bio,
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