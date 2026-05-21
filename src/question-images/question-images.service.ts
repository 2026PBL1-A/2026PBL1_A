import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { QuestionImage } from './entities/question-image.entity';
import { Questions } from '../questions/entities/questions.entity';

@Injectable()
export class QuestionImagesService {
  constructor(
    @InjectRepository(QuestionImage)
    private readonly questionImagesRepository: Repository<QuestionImage>,

    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>,
  ) {}

  // 画像追加
  async create(
    questionId: string,
    imageUrl: string,
    sortOrder?: number,
  ) {
    // 質問が存在するか確認
    const question = await this.questionsRepository.findOneBy({
      id: questionId,
    });

    if (!question) {
      throw new NotFoundException('質問が見つかりません');
    }

    if (sortOrder === undefined) {
        const count = await this.questionImagesRepository.count({
            where: { questionId },
        });
        sortOrder = count;
    }

    const questionImage = this.questionImagesRepository.create({
      id: randomUUID(),
      questionId,
      imageUrl,
      sortOrder,
    });

    return await this.questionImagesRepository.save(questionImage);
  }

  // 質問の画像一覧取得
  async findByQuestionId(questionId: string) {
    return await this.questionImagesRepository.find({
      where: { questionId },
      order: {
        sortOrder: 'ASC',
      },
    });
  }

  // 画像の変更
  async updateQuestionImage(id: string, imageUrl: string, sortOrder?: number) {
    const questionImage = await this.questionImagesRepository.findOneBy({
      id,
    });

    if (!questionImage) {
      throw new NotFoundException('画像が見つかりません');
    }

    questionImage.imageUrl = imageUrl;
    if (sortOrder !== undefined) {
        questionImage.sortOrder = sortOrder;
    }

    return await this.questionImagesRepository.save(questionImage);
  }

  // 画像削除
  async remove(id: string) {
    const questionImage = await this.questionImagesRepository.findOneBy({
      id,
    });

    if (!questionImage) {
      throw new NotFoundException('画像が見つかりません');
    }

    await this.questionImagesRepository.delete({
      id,
    });

    return {
        message: '画像を削除しました',
    };
  }
}