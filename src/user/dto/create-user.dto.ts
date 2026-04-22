import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: '名前を入力してください' })  //エラーメッセージを指定。フロント側が楽になるらしい
    /* フロント側のイメージ by AI
    try {
    await api.createUser(data);
    } catch (error) {
    // バックエンドから届いたメッセージをそのままアラートやラベルに出すだけ！
    this.errorMessage = error.response.data.message[0];
    }*/
    name!: string;
    @IsEmail()
    @IsNotEmpty({ message: '正しいメールアドレス形式で入力してください' })
    email!: string;
    @IsString()
    @IsNotEmpty({ message: 'パスワードを8文字以上で入力してください' })
    @MinLength(8) 
    //パスワードのハッシュ化にbcrypt(ソルトが付く)がおすすめらしい
    password!: string;
}
