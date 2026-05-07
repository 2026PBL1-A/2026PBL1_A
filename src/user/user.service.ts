import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
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
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('このメールアドレスは既に使用されています');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      username: createUserDto.name,
      email: createUserDto.email,
      passwordHash: hashedPassword,
    });
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

  // ログイン用にpasswordHashを明示取得する
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: { id: true, username: true, email: true, passwordHash: true },
    });
  }

  // 指定IDのユーザー情報を更新し、その後最新の状態を取得して返す
  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateData: any = {};
    if (updateUserDto.name) {
      updateData.username = updateUserDto.name;
    }
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateData);
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

    const users = await Promise.all(
      samples.map(async (sample) => {
        const hashedPassword = await bcrypt.hash(sample.password, 10);
        return this.userRepository.create({
          username: sample.name,
          email: sample.email,
          passwordHash: hashedPassword,
        });
      }),
    );

    return this.userRepository.save(users);
  }
}
