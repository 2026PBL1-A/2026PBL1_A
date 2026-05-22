import { Injectable } from '@nestjs/common';
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
            throw new Error('ユーザーは自分自身をフォローできません');
        }
        if (!followingId || !followerId) {
            throw new Error('フォローするユーザーIDとフォロワーのユーザーIDが指定されていません');
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
	async getFollowers(userId: string) {
        // following_idがuserIdのレコードを取得し、follower_idからユーザー情報を取得する
        const follows = await this.followRepository.find({
            where: { following_id: userId },
            relations: ['follower'],
        });

        // ユーザー情報とプロフィール画像URLをまとめて返す
        const result = [] as Array<{ id: string; username: string; iconUrl?: string | null }>;
        for (const f of follows) {
            const profile = await this.profileRepository.findOneBy({ user_id: f.follower.id });
            result.push({ id: f.follower.id, username: f.follower.username, iconUrl: profile?.avatarUrl ?? null });
        }
        
        return result;
	}

	// 指定ユーザーがフォローしているユーザー一覧を取得（following）
	async getFollowing(userId: string) {
        // follower_idがuserIdのレコードを取得し、following_idからユーザー情報を取得する
        const follows = await this.followRepository.find({
            where: { follower_id: userId },
            relations: ['following'],
        });
        
        // ユーザー情報とプロフィール画像URLをまとめて返す
        const result = [] as Array<{ id: string; username: string; iconUrl?: string | null }>;
        for (const f of follows) {
            const profile = await this.profileRepository.findOneBy({ user_id: f.following.id });
            result.push({ id: f.following.id, username: f.following.username, iconUrl: profile?.avatarUrl ?? null });
        }

        return result;
	}
}