import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StringValue } from 'ms';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

// JWT の有効期限は環境変数から受け取り、未設定時は 1 日をデフォルト値にする。
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue;

// 認証機能に必要な依存関係をまとめるモジュール。
// - UserModule: ユーザー情報の参照に利用
// - PassportModule: ガード/ストラテジー連携の基盤
// - JwtModule: トークンの署名設定を提供
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      // 本番では必ず環境変数で秘密鍵を設定すること。
      secret: process.env.JWT_SECRET ?? 'dev_secret_change_me',
      signOptions: { expiresIn: jwtExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}