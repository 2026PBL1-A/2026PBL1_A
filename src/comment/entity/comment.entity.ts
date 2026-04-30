import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
//import { Post } from './post.entity';

// Commentsテーブルに対応するエンティティクラス
@Entity('comment')
export class Comment {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //投稿ID
  /*@ManyToOne((type) => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post!: Post;*/

  //コメントユーザーID
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  //コメント内容
  @Column()
  comment!: string;

  //score　いいね数？
  /*@Column()
  score!: number;*/

  //投稿日時
  @Column({ type: 'datetime', name: 'created_at'})
  created_at!: Date;
}