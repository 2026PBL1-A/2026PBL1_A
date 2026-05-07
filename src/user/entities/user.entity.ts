import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Userテーブルに対応するエンティティクラス
@Entity('USERS')
export class User {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ユーザー名（必須項目）
  @Column({ name: 'username', type: 'varchar', length: 255 })
  username!: string;

  // メールアドレス（ログインや連絡用に使用）
  @Column({ unique: true })
  email!: string;

  // パスワードは通常クエリで返却しない
  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true, select: false })
  passwordHash?: string;
}