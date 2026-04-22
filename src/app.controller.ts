import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// ルートパスのリクエストを受け付けるコントローラー
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET / に対するレスポンスを返す
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
