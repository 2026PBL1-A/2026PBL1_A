import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Posts } from '../../posts/entities/posts.entity';

// Commentsテーブルに対応するエンティティクラス
@Entity('COMMENTS')
export class Comment {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //投稿ID
  @ManyToOne((type) => Posts, (post) => post.content)
  @JoinColumn({ name: 'post_id' })
  post!: Posts;

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

  //投稿日時(自動作成)
  @CreateDateColumn({ type: 'datetime', name: 'created_at'})
  created_at!: Date;
}