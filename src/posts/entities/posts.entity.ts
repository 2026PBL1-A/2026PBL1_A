import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn } from "typeorm";

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
    tag?: string;//?入力なくてもok

    @Column({ default: 0 })
    score!: number;

    @CreateDateColumn()
    created_at!: Date;
}
