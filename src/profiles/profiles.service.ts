import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateProfileDto } from './dto/create-profiles.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Profiles } from './entities/profiles.entity';
import { User } from '../user/entities/user.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Questions } from '../questions/entities/questions.entity';
import { ProfileTag } from '../profile-tags/entities/profile-tags.entity';
import { Tag } from '../tags/entities/tags.entity';

//profileテーブルに対するデータ操作を担当するサービス(userテーブルのServiceから呼び出される)
@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(Profiles)
        private readonly profileRepository: Repository<Profiles>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Posts)
        private readonly postsRepository: Repository<Posts>,
        @InjectRepository(Questions)
        private readonly questionsRepository: Repository<Questions>,
        @InjectRepository(ProfileTag)
        private readonly profileTagRepository: Repository<ProfileTag>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
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
            bio: createProfileDto.bio
            // avatarUrl: createProfileDto.avatarUrl,
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

        if (updateProfileDto.tag_ids) {
            await this.replaceProfileTags(updatedProfile.id, updateProfileDto.tag_ids);
        }

        return {
            user: updatedUser,
            profile: updatedProfile,
        };
    }

    // すべてのプロフィール、ユーザー名、メールアドレスを取得する
    async findAll() {
        const profiles = await this.profileRepository.find({
            relations: {
                profileTags: {
                    tag: true,
                },
            },
        });
        // 各プロフィールに紐づくユーザー情報を付与して返却
        return Promise.all(
            profiles.map(async (p) => {
                const user = await this.userRepository.findOne({ where: { id: p.user_id } });
                return {
                    profile: p,
                    user: user
                        ? { id: user.id, username: user.username, email: user.email }
                        : null,
                };
            }),
        );
    }

    // IDで1件取得する
    async findOne(id: string) {
        const profile = await this.profileRepository.findOne({
            where: { id },
            relations: {
                profileTags: {
                    tag: true,
                },
            },
        });
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        const user = await this.userRepository.findOne({ where: { id: profile.user_id } });
        return {
            profile,
            user: user ? { id: user.id, username: user.username, email: user.email } : null,
        };
    }

    private async replaceProfileTags(profileId: string, tagIds: string[]) {
        await this.profileTagRepository.delete({ profile_id: profileId });

        if (!tagIds.length) {
            return;
        }

        const tags = await this.tagRepository.findBy({ id: In(tagIds) });
        if (tags.length !== tagIds.length) {
            throw new NotFoundException('指定されたタグが見つかりません');
        }

        const profileTags = tagIds.map((tag_id) =>
            this.profileTagRepository.create({
                profile_id: profileId,
                tag_id,
            }),
        );

        await this.profileTagRepository.save(profileTags);
    }

    // プロフィールIDから紐づくユーザーの投稿一覧を取得する
    async findPostsByProfileId(profileId: string) {
        // プロフィール存在確認
        const profile = await this.profileRepository.findOneBy({ id: profileId });
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        // user_id に紐づく投稿を取得
        return this.postsRepository.find({
            where: { user_id: profile.user_id },
            order: { created_at: 'DESC' as any },
        });
    }

    // プロフィールIDから紐づくユーザーの質問一覧を取得する
    async findQuestionsByProfileId(profileId: string) {
        // プロフィール存在確認
        const profile = await this.profileRepository.findOneBy({ id: profileId });
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        // user_id に紐づく質問を取得
        return this.questionsRepository.find({
            where: { user_id: profile.user_id },
            order: { created_at: 'DESC' as any },
        });
    }

    // パスワードを更新する
    async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
        // User の存在確認
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: { id: true, passwordHash: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 新しいパスワードと確認パスワードが一致しているか確認
        if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
            throw new BadRequestException('新しいパスワードと確認パスワードが一致しません');
        }

        // 現在のパスワードが正しいか確認
        const isPasswordValid = await bcrypt.compare(
            updatePasswordDto.currentPassword,
            user.passwordHash || '',
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('現在のパスワードが正しくありません');
        }

        // 新しいパスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

        // パスワードを更新
        await this.userRepository.update(userId, {
            passwordHash: hashedPassword,
        });

        return { message: 'パスワードが正常に更新されました' };
    }
}