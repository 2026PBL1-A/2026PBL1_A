import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entity/comment.entity';
import { Posts } from '../posts/entities/posts.entity';
import { User } from '../user/entities/user.entity';

// Comment機能のDI設定をまとめるモジュール
@Module({
  // CommentエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Comment, Posts, User])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}