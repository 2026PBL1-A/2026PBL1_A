import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Posts } from '../../posts/entities/posts.entity';
import { User } from '../../user/entities/user.entity';

@Entity('POST_SCORES')
export class PostScores {
  @PrimaryColumn({
  type: 'char',
  length: 36,
  name: 'post_id',
})
postId!: string;

  @PrimaryColumn({
  type: 'char',
  length: 36,
  name: 'user_id',
})
  userId!: string;

  @ManyToOne(() => Posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: Posts;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}