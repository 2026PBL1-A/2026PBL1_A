import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionImage } from './entities/question-image.entity';
import { Questions } from '../questions/entities/questions.entity';

import { QuestionImagesService } from './question-images.service';
import { QuestionImagesController } from './question-images.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionImage,
      Questions,
    ]),
  ],
  providers: [QuestionImagesService],
  controllers: [QuestionImagesController],
  exports: [QuestionImagesService],
})
export class QuestionImagesModule {}