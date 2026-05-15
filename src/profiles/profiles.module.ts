import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profiles } from './entities/profiles.entity';
import { User } from '../user/entities/user.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Questions } from '../questions/entities/questions.entity';
import { ProfileTags } from '../profile-tags/entities/profile-tags.entity';
import { Tag } from '../tags/entities/tags.entity';

// Profiles機能のDI設定をまとめるモジュール
@Module({
  // ProfilesエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Profiles, User, Posts, Questions, ProfileTags, Tag])],
  controllers: [ProfileController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
