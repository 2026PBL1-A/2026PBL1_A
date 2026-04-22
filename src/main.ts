import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Nestアプリを生成してHTTPサーバーを起動する
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 開発時の待ち受けポート
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    //whitelist: true,  //必要であれば。dtoに定義されていないプロパティを除外する(セキュリティ向上)
  }));
  await app.listen(5000);
}
bootstrap();
