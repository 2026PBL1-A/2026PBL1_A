import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';

// requestからユーザーIDと投稿IDを取得するためのインターフェース
interface AuthenticatedRequest extends Request {
  user: {userId: string};
  post: { postId: string };
}

// コメントデータのCRUD(作成、取得)を行うコントローラー
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

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

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }

  // 仮のコメントデータ作成
  @Post('seed')
  seed() {
    return this.commentService.seed();
  }
}