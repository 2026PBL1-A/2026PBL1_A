import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostScore } from './entities/post_scores.entity';

@Injectable()
export class PostScoresService {

    constructor(
        @InjectRepository(PostScore)
        private postScoresRepository: Repository<PostScore>,
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

            return {
                liked: false,
            };
        }

        // いいね追加
        const score = this.postScoresRepository.create({
            post_id: postId,
            user_id: userId,
        });

        await this.postScoresRepository.save(score);

        return {
            liked: true,
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