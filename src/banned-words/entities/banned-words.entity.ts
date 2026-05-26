import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('BANNED_WORDS')
export class BannedWords {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  banned_word: string;

  @Column()
  replace_text: string;

  @Column({
    default: true,
  })
  is_active: boolean;
}