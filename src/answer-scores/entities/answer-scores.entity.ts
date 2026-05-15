import { Entity, PrimaryColumn} from 'typeorm';

@Entity('ANSWER_SCORES')
export class AnswerScores {
    @PrimaryColumn({ name: 'user_id' })
    userId!: string;

    @PrimaryColumn({ name: 'answer_id' })
    answerId!: string;
}