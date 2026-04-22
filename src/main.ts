import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Nestアプリを生成してHTTPサーバーを起動する
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 開発時の待ち受けポート
  await app.listen(5000);
}
bootstrap();
