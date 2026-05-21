import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Answers } from '../../answers/entities/answers.entity';
import { Users } from '../../users/entities/users.entity';

@Entity('ANSWER_SCORES')
export class AnswerScores {
    @PrimaryColumn({ name: 'answer_id' })
    answerId!: string;

    @PrimaryColumn({ name: 'user_id' })
    userId!: string;

    @ManyToOne(() => Answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'answer_id' })
    answer?: Answers;

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user?: Users;
}