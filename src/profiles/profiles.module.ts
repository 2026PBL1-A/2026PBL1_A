import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profiles } from './entities/profiles.entity';
import { Users } from '../users/entities/users.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Questions } from '../questions/entities/questions.entity';
import { ProfileTags } from '../profile-tags/entities/profile-tags.entity';
import { Tags } from '../tags/entities/tags.entity';
import { MulterModule } from '@nestjs/platform-express';

// Profiles機能のDI設定をまとめるモジュール
@Module({
  // ProfilesエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Profiles, Users, Posts, Questions, ProfileTags, Tags]),MulterModule.register({}),],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
