import { Transform } from 'class-transformer';
import{IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, IsArray, IsUUID } from 'class-validator';
export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim()) // 空白入力のみを防止
    @MinLength(2,{ message: '2文字以上で入力してください' })
    @MaxLength(100,{ message: '100文字以内で入力してください' })
    title!: string;   //必須項目

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim()) // 空白入力のみを防止
    @MaxLength(5000,{ message: '5000文字以内で入力してください' })
    content!: string;   //必須項目

    @IsString()
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // 空白入力のみを防止
    @MaxLength(1000,{ message: '1000文字以内で入力してください' })
    work_url?: string;   //オプション：制作物URL

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    tag_ids?: string[];   //オプション：タグID配列
}