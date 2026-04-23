import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Userテーブルに対応するエンティティクラス
@Entity()
export class User {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ユーザー名（必須項目）
  @Column()
  name!: string;

  // メールアドレス（ログインや連絡用に使用）
  @Column()
  email!: string;

  // パスワード（未設定の場合もあるためNULL許可）
  @Column({ nullable: true })
  password?: string;
}