import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

import { PostImagesService } from './post-images.service';

@Controller('post-images')
export class PostImagesController {
  constructor(
    private readonly postImagesService: PostImagesService,
  ) {}

  // 画像ファイルをアップロードして保存
  @Post('upload/:postId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: (req, file, callback) => {
          const uniqueName =
            randomUUID() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async upload(
    @Param('postId') postId: string,

    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 最大5MB
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('Order') Order?: string,
  ) {
    // DBに保存するURL
    const imageUrl = `/uploads/posts/${file.filename}`;

    // 既定では sort_order = 0
    return await this.postImagesService.create(
      postId,
      imageUrl,
      Order !== undefined ? parseInt(Order, 10) : undefined,
    );
  }

  // 手動でURLを登録
  @Post()
  async create(
    @Body()
    body: {
      postId: string;
      imageUrl: string;
      sortOrder?: number;
    },
  ) {
    return await this.postImagesService.create(
      body.postId,
      body.imageUrl,
      body.sortOrder,
    );
  }

  // 投稿ごとの画像一覧取得
  @Get('post/:postId')
  async findByPostId(
    @Param('postId') postId: string,
  ) {
    return await this.postImagesService.findByPostId(
      postId,
    );
  }

  // 画像ファイルをアップロードして既存画像を差し替える
  @Patch('upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: (req, file, callback) => {
          const uniqueName =
            randomUUID() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async uploadAndUpdatePostImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/posts/${file.filename}`;

    return await this.postImagesService.updatePostImage(
      id,
      imageUrl,
    );
  }

  // 画像削除
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    return await this.postImagesService.remove(id);
  }
}