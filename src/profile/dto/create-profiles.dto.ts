import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

//プロフィールデータの作成に必要なデータの型とバリデーションを定義
export class CreateProfileDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty({ message: 'userIdを入力してください' })
    userId!: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;
}
