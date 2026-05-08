import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
//ユーザーデータの作成に必要なデータの型とバリデーションを定義
export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: '内容を入力してください' })
    comment!: string;

    @IsUUID()
    @IsNotEmpty({ message: '投稿IDを入力してください' })
    postId!: string;

    @IsUUID()
    @IsNotEmpty({ message: 'ユーザーIDを入力してください' })
    userId!: string;
}
