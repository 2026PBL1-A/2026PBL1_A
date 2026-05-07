import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // メールアドレスとパスワードでログインを行う。
  // 認証に成功すると、JWT アクセストークンを発行して返却する。
  async login(email: string, password: string) {
    // メールアドレスでユーザーを検索する。
    const user = await this.userService.findByEmail(email);

    // ユーザーが存在しない、またはパスワード未登録の場合は認証失敗。
    // アカウントの存在有無を推測されないよう、固定メッセージを返す。
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');
    }

    // 平文パスワードとハッシュ化済みパスワードを安全に比較する。
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    // 不一致なら認証失敗。
    if (!isMatch) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');
    }

    // JWT の標準的なクレームとして sub(ユーザーID) を格納。
    const payload = { sub: user.id, email: user.email, name: user.username };

    return {
      // 署名付きトークンを生成してクライアントへ返す。
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    };
  }
}