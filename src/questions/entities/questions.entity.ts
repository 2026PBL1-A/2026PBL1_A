import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity('QUESTIONS')
export class Questions {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    user_id!: string;

    @Column()
    title!: string;

    @Column('text')
    content!: string;

    @CreateDateColumn()
    created_at!: Date;
}