import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

// 認証系エンドポイントを提供するコントローラー。
// 現在はログイン処理のみを公開する。
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  // リクエストボディで受け取ったメールアドレスとパスワードを AuthService に委譲し、
  // 認証成功時にはアクセストークンを返す。
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}