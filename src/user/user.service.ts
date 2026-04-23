import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

// Userテーブルに対するデータ操作を担当するサービス
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // DTOをUserエンティティに変換し、DBへ保存する（バリデーション後のデータを永続化）
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  // すべてのユーザーを取得する
  async findAll() {
    return this.userRepository.find();
  }

  // IDで1件取得する
  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  // 指定IDのユーザー情報を更新し、その後最新の状態を取得して返す
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  // 指定IDのユーザーを削除し、削除結果を返す
  async remove(id: string) {
    await this.userRepository.delete(id);
    return { deleted: true };
  }

  // 開発・テスト用にサンプルユーザーデータをDBへ登録する
  async seed() {
    const samples: CreateUserDto[] = [
      { name: 'Taro Yamada', email: 'taro@example.com', password: 'pass1234' },
      { name: 'Hanako Sato', email: 'hanako@example.com', password: 'pass1234' },
      { name: 'John Doe', email: 'john@example.com', password: 'pass1234' },
    ];

    const users = this.userRepository.create(samples);
    return this.userRepository.save(users);
  }
}
