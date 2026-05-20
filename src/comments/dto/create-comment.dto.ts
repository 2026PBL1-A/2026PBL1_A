import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
//コメントの作成に必要なデータの型とバリデーションを定義
export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: '内容を入力してください' })
    @Transform(({ value }) => value.trim()) // 空白入力のみを防止
    comment!: string;

    @IsUUID()
    @IsNotEmpty({ message: '投稿IDを入力してください' })
    postId!: string;

    @IsUUID()
    @IsNotEmpty({ message: 'ユーザーIDを入力してください' })
    userId!: string;
}
