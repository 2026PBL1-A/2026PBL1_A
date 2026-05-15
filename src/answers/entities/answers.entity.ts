import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Questions } from '../../questions/entities/questions.entity';

// Answersテーブルに対応するエンティティクラス
@Entity('ANSWERS')
export class Answers {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //質問ID
  @ManyToOne((type) => Questions)
  @JoinColumn({ name: 'question_id' })
  questionId!: Questions;

  //回答ユーザーID
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  userId!: Users;

  //回答内容
  @Column()
  comment!: string;

  //いいね数
  @Column({ default: 0 })
  score!: number;

  //投稿日時(自動作成)
  @CreateDateColumn({ type: 'datetime', name: 'created_at'})
  created_at!: Date;
}