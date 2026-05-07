import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profiles.controller';
import { ProfileService } from './profiles.service';
import { Profile } from './entities/profiles.entity';
import { User } from '../user/entities/user.entity';

// Profile機能のDI設定をまとめるモジュール
@Module({
  // ProfileエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Profile, User])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
