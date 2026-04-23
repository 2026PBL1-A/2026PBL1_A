import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

//ユーザーデータのCRUD(作成、取得、更新、削除)を行うコントローラー
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //仮のユーザーデータを作成
  @Post('seed')
  seed() {
    return this.userService.seed();
  }

  //ユーザーデータ作成して保存
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //全ユーザーデータの取得
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //ユーザーのidを指定してデータ取得
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  //ユーザーのidを指定して更新
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  //ユーザーのidを指定して削除
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
