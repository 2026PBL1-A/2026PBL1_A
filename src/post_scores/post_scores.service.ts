import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostScore } from './entities/post_scores.entity';
import { Posts } from '../posts/entities/posts.entity';

@Injectable()
export class PostScoresService {

    constructor(
        @InjectRepository(PostScore)
        private postScoresRepository: Repository<PostScore>,
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
    ) {}

    // 切り替え
    async toggleScore(postId: string, userId: string) {

        const exists = await this.postScoresRepository.findOneBy({
            post_id: postId,
            user_id: userId,
        });

        // 既にいいね済み → 解除
        if (exists) {

            await this.postScoresRepository.delete({
                post_id: postId,
                user_id: userId,
            });
        } else {
            // いいね追加
            const score = this.postScoresRepository.create({
                post_id: postId,
                user_id: userId,
            });

            await this.postScoresRepository.save(score);
        }

        // ★ POST_SCOREテーブルのレコード数をカウントして POSTS.score を更新
        const count = await this.postScoresRepository.count({
            where: { post_id: postId },
        });
        await this.postsRepository.update(postId, { score: count });

        return {
            liked: !exists,
            score: count,
        };
    }

    // スコア取得
    async getScore(postId: string) {

        const count = await this.postScoresRepository.count({
            where: {
                post_id: postId,
            },
        });

        return {
            score: count,
        };
    }
}
