import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';

// requestからユーザーIDと投稿IDを取得するためのインターフェース
interface AuthenticatedRequest extends Request {
  user: {userId: string};
  post: { postId: string };
}

// コメントデータのCRUD(作成、取得)を行うコントローラー
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 投稿IDを指定してコメントデータ取得
  @Get('post/:postId')
  findByPostId(@Param('postId') postId: string) {
    return this.commentService.findByPostId(postId);
  }

  // コメントのidを指定してデータ取得
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  } 

  // 仮のコメントデータ作成
  @Post('seed')
  seed() {
    return this.commentService.seed();
  }
}