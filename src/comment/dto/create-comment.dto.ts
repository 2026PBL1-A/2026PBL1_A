import { IsNotEmpty, IsString } from 'class-validator';
//ユーザーデータの作成に必要なデータの型とバリデーションを定義
export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: '内容を入力してください' })
    comment!: string;
    postid!: string;
    userid!: string;
}
