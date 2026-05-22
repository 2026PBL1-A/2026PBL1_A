import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
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
}