import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { Follows } from './entities/follows.entity';

// followsテーブルに対するデータ操作を担当するサービス
@Injectable()
export class FollowsService {
    constructor(
            @InjectRepository(Users)
            private readonly userRepository: Repository<Users>,
            @InjectRepository(Follows)
            private readonly followRepository: Repository<Follows>,
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
		const follows = await this.followRepository.find({
			where: { following_id: userId },
			relations: ['follower'],
		});
		return follows.map((f) => ({ id: f.follower.id, username: f.follower.username }));
	}

	// 指定ユーザーがフォローしているユーザー一覧を取得（following）
	async getFollowing(userId: string) {
		const follows = await this.followRepository.find({
			where: { follower_id: userId },
			relations: ['following'],
		});
		return follows.map((f) => ({ id: f.following.id, username: f.following.username }));
	}
}