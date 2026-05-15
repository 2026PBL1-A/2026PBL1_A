import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Questions } from '../../questions/entities/questions.entity';
import { Tags } from '../../tags/entities/tags.entity';

@Entity('QUESTION_TAGS')
export class QuestionTags {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  question_id: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  tag_id: string;

  @ManyToOne(() => Questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Questions;

  @ManyToOne(() => Tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tags;
}