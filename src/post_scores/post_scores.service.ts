import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostScore } from './entities/post_scores.entity';
import { Posts } from '../posts/entities/posts.entity';

@Injectable()
export class PostScoresService {
    constructor(
        @InjectRepository(PostScore)
        private readonly postScoresRepository: Repository<PostScore>,

        @InjectRepository(Posts)
        private readonly postsRepository: Repository<Posts>,
    ) {}

    // 切り替え
    async toggleScore(postId: string, userId: string) {
        const exists = await this.postScoresRepository.findOneBy({
            postId,
            userId,
        });

        // 既にいいね済み → 解除
        if (exists) {
            await this.postScoresRepository.delete({
                postId,
                userId,
            });
        } else {
            // いいね追加
            const postScore = this.postScoresRepository.create({
                postId,
                userId,
            });

            await this.postScoresRepository.save(postScore);
        }

        // ★ POST_SCOREテーブルのレコード数をカウントして POSTS.score を更新
        const count = await this.postScoresRepository.count({
            where: {
                postId
            },
        });

        await this.postsRepository.update(
            { id: postId },
            { score: count });

        return {
            liked: !exists,
            score: count,
        };
    }

    // スコア取得
    async getScore(postId: string) {
        const count = await this.postScoresRepository.count({
            where: {
                postId,
            },
        });

        return {
            score: count,
        };
    }
}
