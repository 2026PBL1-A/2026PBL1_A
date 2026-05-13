import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @Matches(/^[a-zA-Z0-9]*@st\.kobedenshi\.ac\.jp$/, { message: 'stメールを入力してください' })
  @IsEmail()
  @IsNotEmpty({ message: '正しいメールアドレス形式で入力してください' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'パスワードを入力してください' })
  password!: string;
}