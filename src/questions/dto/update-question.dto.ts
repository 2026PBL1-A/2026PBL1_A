import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateQuestionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // 空白入力のみを防止
    @MinLength(2, { message: '2文字以上で入力してください' })
    @MaxLength(100, { message: '100文字以内で入力してください' })
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // 空白入力のみを防止
    @MaxLength(5000, { message: '5000文字以内で入力してください' })
    content?: string;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    tag_ids?: string[];
}