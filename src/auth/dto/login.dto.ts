import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: '正しいメールアドレス形式で入力してください' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'パスワードを入力してください' })
  password!: string;
}