import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from './entities/tags.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PostTags } from '../post-tags/entities/post-tags.entity';
import { QuestionTags } from '../question-tags/entities/question-tags.entity';
import { ProfileTags } from '../profile-tags/entities/profile-tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tags, PostTags, QuestionTags, ProfileTags])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}