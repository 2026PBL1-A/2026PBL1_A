import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostScores } from './entities/post-scores.entity';
import { Posts } from '../posts/entities/posts.entity';

@Injectable()
export class PostScoresService {
    constructor(
        @InjectRepository(PostScores)
        private readonly postScoresRepository: Repository<PostScores>,

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

        // ★ POST_SCORESテーブルのレコード数をカウントして POSTS.score を更新
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
