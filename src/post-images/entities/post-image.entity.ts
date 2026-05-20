import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Posts } from '../../posts/entities/posts.entity';

@Entity('POST_IMAGES')
export class PostImage {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'post_id', type: 'varchar', length: 36 })
  postId!: string;

  @Column({ name: 'image_url', type: 'varchar', length: 1000 })
  imageUrl!: string;

  @Column({
    name: 'sort_order',
    type: 'int',
    default: 0,
  })
  sortOrder!: number;

  @ManyToOne(() => Posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: Posts;
}