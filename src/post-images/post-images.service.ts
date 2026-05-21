import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { PostImage } from './entities/post-image.entity';
import { Posts } from '../posts/entities/posts.entity';

@Injectable()
export class PostImagesService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImagesRepository: Repository<PostImage>,

    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  // 画像追加
  async create(
    postId: string,
    imageUrl: string,
    sortOrder?: number,
  ) {
    // 投稿が存在するか確認
    const post = await this.postsRepository.findOneBy({
      id: postId,
    });

    if (!post) {
      throw new NotFoundException('投稿が見つかりません');
    }

    if (sortOrder === undefined) {
        const count = await this.postImagesRepository.count({
            where: { postId },
        });
        sortOrder = count;
    }

    const postImage = this.postImagesRepository.create({
      id: randomUUID(),
      postId,
      imageUrl,
      sortOrder,
    });

    return await this.postImagesRepository.save(postImage);
  }

  // 投稿の画像一覧取得
  async findByPostId(postId: string) {
    return await this.postImagesRepository.find({
      where: { postId },
      order: {
        sortOrder: 'ASC',
      },
    });
  }

  // 画像の変更
  async updatePostImage(id: string, imageUrl: string, sortOrder?: number) {
    const image = await this.postImagesRepository.findOneBy({
      id,
    });

    if (!image) {
      throw new NotFoundException('画像が見つかりません');
    }

    image.imageUrl = imageUrl;
    if (sortOrder !== undefined) {
        image.sortOrder = sortOrder;
    }

    return await this.postImagesRepository.save(image);
  }

  // 画像削除
  async remove(id: string) {
    const image = await this.postImagesRepository.findOneBy({
      id,
    });

    if (!image) {
      throw new NotFoundException('画像が見つかりません');
    }

    await this.postImagesRepository.delete({
      id,
    });

    return {
      message: '画像を削除しました',
    };
  }
}