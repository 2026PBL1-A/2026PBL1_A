import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn, OneToMany } from "typeorm";
import { QuestionTag } from "../../question-tags/entities/question-tags.entity";

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

    @OneToMany(() => QuestionTag, (questionTag) => questionTag.question)
    questionTags!: QuestionTag[];

    @CreateDateColumn()
    created_at!: Date;
}