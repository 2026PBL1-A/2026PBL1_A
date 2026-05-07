import { IsOptional, IsString } from 'class-validator';

//プロフィールデータの作成に必要なデータの型とバリデーションを定義
export class CreateProfileDto {
    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    tag?: string;

    // アバターURL（現在開発中）
    // @IsString()
    // @IsOptional()
    // avatarUrl?: string;
}
