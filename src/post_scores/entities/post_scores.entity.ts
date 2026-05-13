import { Entity, PrimaryColumn } from 'typeorm';

@Entity('POST_SCORE')
export class PostScore {

    @PrimaryColumn('uuid')
    post_id!: string;

    @PrimaryColumn('uuid')
    user_id!: string;
}