import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { Profiles } from '../profiles/entities/profiles.entity';
import { Follows } from './entities/follows.entity';

// followsテーブルに対するデータ操作を担当するサービス
@Injectable()
export class FollowsService {
    constructor(
            @InjectRepository(Users)
            private readonly userRepository: Repository<Users>,
            @InjectRepository(Follows)
            private readonly followRepository: Repository<Follows>,
            @InjectRepository(Profiles)
            private readonly profileRepository: Repository<Profiles>,
        ) {}

    async create(followingId: string, followerId: string) {
        if (followingId === followerId) {
            throw new BadRequestException('ユーザーは自分自身をフォローできません');
        }
        if (!followingId || !followerId) {
            throw new BadRequestException('フォローするユーザーIDとフォロワーのユーザーIDが指定されていません');
        }

        const follower = await this.followRepository.findOneBy({ following_id: followingId, follower_id: followerId });
        
        // 既にフォローしている場合は解除する
        if (follower) {
            return await this.followRepository.delete({ following_id: followingId, follower_id: followerId });
        }
        else {
            return await this.followRepository.save({ following_id: followingId, follower_id: followerId });
        }
    }

	// 指定ユーザーをフォローしているユーザー一覧を取得（followers）
	// following_id = フォローする側なので、follower_id が userId のレコードを探す
	async getFollowers(userId: string) {
        const follows = await this.followRepository.find({
            where: { follower_id: userId },
            relations: ['following'],
        });

        // フォローしてくれているユーザー（following）の情報を返す
        const result = [] as Array<{ id: string; username: string; iconUrl?: string | null }>;
        for (const f of follows) {
            const profile = await this.profileRepository.findOneBy({ user_id: f.following.id });
            result.push({ id: f.following.id, username: f.following.username, iconUrl: profile?.avatarUrl ?? null });
        }
        
        return result;
	}

	// 指定ユーザーがフォローしているユーザー一覧を取得（following）
	// following_id = フォローする側なので、following_id が userId のレコードを探す
	async getFollowing(userId: string) {
        const follows = await this.followRepository.find({
            where: { following_id: userId },
            relations: ['follower'],
        });
        
        // フォローしている相手（follower）の情報を返す
        const result = [] as Array<{ id: string; username: string; iconUrl?: string | null }>;
        for (const f of follows) {
            const profile = await this.profileRepository.findOneBy({ user_id: f.follower.id });
            result.push({ id: f.follower.id, username: f.follower.username, iconUrl: profile?.avatarUrl ?? null });
        }

        return result;
	}
}