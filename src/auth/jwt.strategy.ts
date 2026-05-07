import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// JWT の検証ルールを定義する Passport ストラテジー。
// JwtAuthGuard から呼ばれ、トークンの抽出・署名検証・有効期限検証を行う。
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Authorization ヘッダーの Bearer トークンから JWT を取り出す。
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 有効期限切れトークンは許可しない。
      ignoreExpiration: false,
      // 署名検証に使う秘密鍵。
      secretOrKey: process.env.JWT_SECRET ?? 'dev_secret_change_me',
    });
  }

  // 署名・期限チェックを通過した payload をアプリ内で扱うユーザー情報に整形する。
  // 返り値は req.user としてコントローラー/ガードから参照できる。
  validate(payload: { sub: string; email: string; name: string }) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}