import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentController } from './comments.controller';
import { Comments } from './entities/comments.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Users } from '../users/entities/users.entity';

// Comment機能のDI設定をまとめるモジュール
@Module({
  // CommentエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Comments, Posts, Users])],
  controllers: [CommentController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}