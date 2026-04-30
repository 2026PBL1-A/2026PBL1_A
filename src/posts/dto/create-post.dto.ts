import{IsString, IsNotEmpty, IsOptional, IsInt, MinLength, } from 'class-validator';
export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    user_id!: string;   //必須項目

    @IsString()
    @IsNotEmpty()
    @MinLength(2,{ message: '2文字以上で入力してください' })
    title!: string;   //必須項目

    @IsString()
    @IsNotEmpty()
    content!: string;   //必須項目

    @IsString()
    @IsOptional()
    tag?: string;
}