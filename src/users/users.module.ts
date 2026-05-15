import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { Users } from './entities/users.entity';
import { ProfilesModule } from '../profiles/profiles.module';

// Users機能のDI設定をまとめるモジュール
@Module({
  // UsersエンティティのRepositoryをServiceで利用可能にする
  imports: [TypeOrmModule.forFeature([Users]), ProfilesModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
