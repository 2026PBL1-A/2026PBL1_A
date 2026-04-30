import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn } from "typeorm";

@Entity('POSTS')
export class Posts {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    user_id!: string;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column({ nullable: true })
    tag!: string;

    @Column({ default: 0 })
    score: number;

    @CreateDateColumn()
    created_at!: Date;
}
