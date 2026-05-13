import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAnswerScoreDto {
    @IsNotEmpty({message: 'ユーザーIDが空です'})
    @IsUUID()
    user_id!: string;

    @IsNotEmpty({message: '回答IDが空です'})
    @IsUUID()
    answer_id!: string;
}