import { Transform } from 'class-transformer';
import{IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, } from 'class-validator';
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
    @IsNotEmpty()
    type!: string; 

    @IsString()
    @IsOptional()
    @MaxLength(20,{ message: '20文字以内で入力してください' })
    
    tag?: string;
}