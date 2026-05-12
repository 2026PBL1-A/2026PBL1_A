import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Questions } from '../../questions/entities/questions.entity';
import { Tag } from '../../tags/entities/tags.entity';

@Entity('QUESTION_TAGS')
export class QuestionTag {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  question_id: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  tag_id: string;

  @ManyToOne(() => Questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Questions;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}