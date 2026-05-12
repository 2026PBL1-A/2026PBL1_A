import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Questions } from '../../questions/entities/questions.entity';

// Answersテーブルに対応するエンティティクラス
@Entity('ANSWERS')
export class Answer {
  // 主キー（UUID文字列）
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //質問ID
  @ManyToOne((type) => Questions)
  @JoinColumn({ name: 'question_id' })
  questionId!: Questions;

  //回答ユーザーID
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  userId!: User;

  //回答内容
  @Column()
  comment!: string;

  //投稿日時(自動作成)
  @CreateDateColumn({ type: 'datetime', name: 'created_at'})
  created_at!: Date;
}