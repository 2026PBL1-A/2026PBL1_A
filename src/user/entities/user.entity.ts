import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Userテーブルに対応するエンティティクラス
@Entity('USES')
export class User {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ユーザー名（必須項目）
  @Column({ name: 'username' })
  name!: string;

  // メールアドレス（ログインや連絡用に使用）
  @Column()
  email!: string;

  // パスワード（未設定の場合もあるためNULL許可）
  @Column({ name: 'password_hash', nullable: true })
  password?: string;
}