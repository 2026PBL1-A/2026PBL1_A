import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profiles.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profiles.entity';
import { User } from '../user/entities/user.entity';

//profileテーブルに対するデータ操作を担当するサービス(userテーブルのServiceから呼び出される)
@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // DTOをProfileエンティティに変換し、DBへ保存する（バリデーション後のデータを永続化）
    async create(createProfileDto: CreateProfileDto, userId: string) {
        if (!userId) {
            // ユーザー不在はエラー
            throw new NotFoundException('User not found');
        }

        // エンティティを作成
        const profile = this.profileRepository.create({
            user_id: userId,
            bio: createProfileDto.bio,
            tag: createProfileDto.tag,
            avatarUrl: createProfileDto.avatarUrl,
        });

        // 保存して作成済みのレコードを返却
        return this.profileRepository.save(profile);
    }

    // ユーザー名と自己紹介文を更新する
    // username は USERS テーブル、bio は PROFILES テーブルを更新する
    async update(userId: string, updateProfileDto: UpdateProfileDto) {
        // User の存在確認
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Profile の取得
        const profile = await this.profileRepository.findOne({
            where: { user_id: userId },
        });
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        // 更新内容の反映
        if (updateProfileDto.username) {
            user.username = updateProfileDto.username;
        }
        if (updateProfileDto.bio !== undefined) {
            profile.bio = updateProfileDto.bio;
        }

        // 両方保存して返却
        const updatedUser = await this.userRepository.save(user);
        const updatedProfile = await this.profileRepository.save(profile);

        return {
            user: updatedUser,
            profile: updatedProfile,
        };
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