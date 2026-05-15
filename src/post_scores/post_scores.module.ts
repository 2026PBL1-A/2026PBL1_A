import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostScores } from './entities/post_scores.entity';
import { PostScoresService } from './post_scores.service';
import { PostScoresController } from './post_scores.controller';
import { Posts } from '../posts/entities/posts.entity';  // ← 追加
@Module({
    imports: [
        TypeOrmModule.forFeature([PostScores, Posts]),  // ← Posts を追加
    ],
    controllers: [PostScoresController],
    providers: [PostScoresService],
    exports: [PostScoresService],
})
export class PostScoresModule {}