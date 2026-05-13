import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostScore } from './entities/post_scores.entity';
import { PostScoresService } from './post_scores.service';
import { PostScoresController } from './post_scores.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostScore]),
    ],
    controllers: [PostScoresController],
    providers: [PostScoresService],
})
export class PostScoresModule {}