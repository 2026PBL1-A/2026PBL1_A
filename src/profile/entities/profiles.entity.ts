import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn, OneToMany } from "typeorm";
import { ProfileTag } from "../../profile-tags/entities/profile-tags.entity";

// Profilesテーブルに対応するエンティティクラス
@Entity('PROFILES')
export class Profile {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ユーザーID（Userテーブルのidと紐づく外部キー）
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  user_id!: string;

  // 自己紹介文
  @Column({ name: 'bio', type: 'text', nullable: true })
  bio?: string;

  @OneToMany(() => ProfileTag, (profileTag) => profileTag.profile)
  profileTags!: ProfileTag[];

  // アバターのURL（現在開発中）
  // @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  // avatarUrl?: string;
}