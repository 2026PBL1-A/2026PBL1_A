import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profiles.service';
import { Profile } from './entities/profiles.entity';
import { User } from '../user/entities/user.entity';

// Profile機能のDI設定をまとめるモジュール
@Module({
  // ProfileエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Profile, User])],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
