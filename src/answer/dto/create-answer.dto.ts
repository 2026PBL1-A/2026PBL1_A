import { IsNotEmpty, IsString, IsInt } from 'class-validator';
//ユーザーデータの作成に必要なデータの型とバリデーションを定義
export class CreateAnswerDto {
    @IsString()
    @IsNotEmpty({ message: '内容を入力してください' })
    comment!: string;
    questionid!: string;
    userid!: string;
}
