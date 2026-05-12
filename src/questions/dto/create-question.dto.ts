import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, } from 'class-validator';

export class CreateQuestionDto {
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
    content!: string
} 