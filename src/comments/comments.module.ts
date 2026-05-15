import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentController } from './comments.controller';
import { Comments } from './entities/comments.entity';
import { Posts } from '../posts/entities/posts.entity';
import { User } from '../user/entities/user.entity';

// Comment機能のDI設定をまとめるモジュール
@Module({
  // CommentエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Comments, Posts, User])],
  controllers: [CommentController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}