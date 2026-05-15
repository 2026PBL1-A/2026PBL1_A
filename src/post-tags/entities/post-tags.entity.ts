import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Posts } from '../../posts/entities/posts.entity';
import { Tags } from '../../tags/entities/tags.entity';

@Entity('POST_TAGS')
export class PostTags {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    post_id!: string;

    @PrimaryColumn({ type: 'varchar', length: 36 })
    tag_id!: string;

    @ManyToOne(() => Posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Posts;

    @ManyToOne(() => Tags, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tags;
}