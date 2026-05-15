import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { ProfileModule } from '../profiles/profiles.module';

// User機能のDI設定をまとめるモジュール
@Module({
  // UserエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([User]), ProfileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
