import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/users.entity';
import { ProfilesService } from '../profiles/profiles.service';

// Userテーブルに対するデータ操作を担当するサービス
// ユーザー作成時には自動でid,user_id以外が空のプロフィール（`PROFILES`）を作成する
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly profilesService: ProfilesService,
  ) {}

  private async createUserWithProfile(createUserDto: CreateUserDto) {
    // 同一メールアドレスが既に存在しないか確認
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      select: { id: true },
    });

    if (existing) {
      // 重複があれば Conflict を返す
      throw new ConflictException('このメールアドレスは既に使用されています');
    }

    // パスワードをハッシュ化してエンティティを作成
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      username: createUserDto.name,
      email: createUserDto.email,
      // DB カラムは `password_hash`。エンティティ側では `passwordHash` として扱う
      passwordHash: hashedPassword,
    });

    // ユーザーを保存し、保存後にプロフィールを作成
    // 空オブジェクト `{}` を渡すことで `id` と `user_id` のみが設定される
    const saved = await this.userRepository.save(user);
    await this.profilesService.create({}, saved.id);

    // 保存したユーザーを返す
    return saved;
  }

  // DTOをUserエンティティに変換し、DBへ保存する（バリデーション後のデータを永続化）
  async create(createUserDto: CreateUserDto) {
    // API 等から呼ばれる標準のユーザー作成エントリ
    // 内部でプロフィール作成を含む共通処理を呼び出す
    return this.createUserWithProfile(createUserDto);
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
    // ログイン処理等でパスワードハッシュを確認するために使う
    // 必要なカラムのみを select して返す
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
      // パスワードが渡されたらハッシュ化して更新データに含める
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  // 指定IDのユーザーを削除し、削除結果を返す
  async remove(id: string) {
    // ユーザーを削除する（関連する PROFILES レコードは FK の ON DELETE CASCADE により削除される）
    await this.userRepository.delete(id);
    return { deleted: true };
  }

  // 開発・テスト用にサンプルユーザーデータをDBへ登録する
  async seed() {
    const samples: CreateUserDto[] = [
      { name: 'Taro Yamada', email: 'taro@st.kobedenshi.ac.jp', password: 'pass1234' },
      { name: 'Hanako Sato', email: 'hanako@st.kobedenshi.ac.jp', password: 'pass1234' },
      { name: 'John Doe', email: 'john@st.kobedenshi.ac.jp', password: 'pass1234' },
      { name: 'st user', email: 'kd1234@st.kobedenshi.ac.jp', password: 'pass1234' }
    ];

    // 開発用にサンプルユーザーを順に作成する
    // createUserWithProfile を使うことで各ユーザーに対応する空プロフィールも作成される
    const users: Users[] = [];
    for (const sample of samples) {
      users.push(await this.createUserWithProfile(sample));
    }

    return users;
  }
}
