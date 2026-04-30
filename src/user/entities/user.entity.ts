import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Userテーブルに対応するエンティティクラス
@Entity('USERS')
export class User {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ユーザー名（必須項目）
  @Column()
  name!: string;

  // メールアドレス（ログインや連絡用に使用）
  @Column({ unique: true })
  email!: string;

  // パスワードは通常クエリで返却しない
  @Column({ nullable: true, select: false })
  password?: string;
}