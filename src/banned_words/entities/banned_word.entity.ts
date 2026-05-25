import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('BANNED_WORDS')
export class BannedWord {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    id!: string;

    @Column({ unique: true, type: 'varchar', length: 255 })
    banned_word!: string;

    @Column({ type: 'varchar', length: 255 })
    replace_text!: string;

    @Column({ default: true })
    is_active!: boolean;
}