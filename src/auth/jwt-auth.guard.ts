import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Passport の jwt ストラテジーを NestJS の Guard として利用する。
// 保護したいルートに適用すると、Authorization: Bearer <token> を検証する。
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}