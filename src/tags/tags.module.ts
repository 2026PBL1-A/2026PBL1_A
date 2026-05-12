import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tags.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PostTag } from '../post-tags/entities/post-tags.entity';
import { QuestionTag } from '../question-tags/entities/question-tags.entity';
import { ProfileTag } from '../profile-tags/entities/profile-tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, PostTag, QuestionTag, ProfileTag])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}