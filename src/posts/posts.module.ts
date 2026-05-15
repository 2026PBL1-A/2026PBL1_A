import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts } from './entities/posts.entity';
import { PostTags } from '../post-tags/entities/post-tags.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, PostTags])
],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService], // 他のモジュールでPostsServiceを使用できるようにエクスポート
})
export class PostsModule {}