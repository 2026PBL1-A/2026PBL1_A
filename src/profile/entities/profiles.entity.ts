import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

// Profilesテーブルに対応するエンティティクラス
@Entity('PROFILES')
export class Profile {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ユーザー（外部キー）UNIQUE制約を付与
  @OneToOne(() => User)
  @JoinColumn({})
  user_id!: User;

  // user_id から取得したユーザー名
  @Column({ name: 'username', type: 'varchar', length: 255 })
  username!: string;

  // 自己紹介文
  @Column({ name: 'bio', type: 'text', nullable: true })
  bio?: string;

  // アバターのURL
  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  avatarUrl?: string;

  // 作成日時（自動管理）
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  // 更新日時（自動管理）
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}