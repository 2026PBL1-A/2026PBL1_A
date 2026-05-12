import { Entity, Column } from 'typeorm';

@Entity('ANSWER_SCORES')
export class AnswerScore {
    @Column()
    user_id!: string;

    @Column()
    answer_id!: string;
}