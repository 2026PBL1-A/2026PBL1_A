import { IsNotEmpty, IsString, MinLength } from 'class-validator';
//ユーザーデータの作成に必要なデータの型とバリデーションを定義
export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: 'コメントを入力してください' })
    comment!: string;
    
}
