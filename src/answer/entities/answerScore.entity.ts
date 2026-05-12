import { Entity, PrimaryColumn} from 'typeorm';

@Entity('ANSWER_SCORE')
export class AnswerScore {
    @PrimaryColumn({ name: 'user_id' })
    userId!: string;

    @PrimaryColumn({ name: 'answer_id' })
    answerId!: string;
}