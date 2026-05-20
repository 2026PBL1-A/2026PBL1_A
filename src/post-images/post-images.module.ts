import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostImage } from './entities/post-image.entity';
import { Posts } from '../posts/entities/posts.entity';

import { PostImagesService } from './post-images.service';
import { PostImagesController } from './post-images.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostImage,
      Posts,
    ]),
  ],
  providers: [PostImagesService],
  controllers: [PostImagesController],
  exports: [PostImagesService],
})
export class PostImagesModule {}