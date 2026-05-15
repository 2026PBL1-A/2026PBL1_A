import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Posts } from '../../posts/entities/posts.entity';

// Commentsテーブルに対応するエンティティクラス
@Entity('COMMENTS')
export class Comments {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //投稿ID
  @ManyToOne(() => Posts)
  @JoinColumn({ name: 'post_id' })
  postId!: Posts;

  //コメントユーザーID
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  userId!: Users;

  //コメント内容
  @Column()
  comment!: string;

  //score　いいね数？
  // @Column({ default: 0 })
  // score!: number;

  //投稿日時(自動作成)
  @CreateDateColumn({ type: 'datetime', name: 'created_at'})
  created_at!: Date;
}