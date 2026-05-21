import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Questions } from '../../questions/entities/questions.entity';

@Entity('QUESTION_IMAGES')
export class QuestionImage {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'question_id', type: 'varchar', length: 36 })
    questionId!: string;

    @Column({ name: 'image_url', type: 'varchar', length: 1000 })
    imageUrl!: string;

    @Column({
        name: 'sort_order',
        type: 'int',
        default: 0,
    })
    sortOrder!: number;

    @ManyToOne(() => Questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_id' })
    question!: Questions;
}