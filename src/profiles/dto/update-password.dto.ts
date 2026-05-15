import { IsString, MinLength } from 'class-validator';

// パスワード更新時に受け取る項目を定義するDTO
export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'パスワードを8文字以上で入力してください' })
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
