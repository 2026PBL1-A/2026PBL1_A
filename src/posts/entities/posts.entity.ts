import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn, OneToMany } from "typeorm";
import { PostTags } from "../../post-tags/entities/post-tags.entity";


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

    @Column({ nullable: true })
    work_url?: string;

    @Column({ default: 0 })
    score!: number;

    @OneToMany(() => PostTags, (postTags) => postTags.post)
    postTags!: PostTags[];

    @CreateDateColumn()
    created_at!: Date;
}
