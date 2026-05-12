import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn, OneToMany } from "typeorm";
import { PostTag } from "../../post-tags/entities/post-tags.entity";


@Entity('POSTS')
export class Posts {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    user_id!: string;

    @Column()
    title!: string;

    @Column('text')
    content!: string;

    @Column({ default: 0 })
    score!: number;

    @OneToMany(() => PostTag, (postTag) => postTag.post)
    postTags!: PostTag[];

    @CreateDateColumn()
    created_at!: Date;
}
