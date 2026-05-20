import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

// Nestアプリを生成してHTTPサーバーを起動する
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
  });
  // 開発時の待ち受けポート
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // uploads フォルダを静的公開
  app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads/',
    },
  );

  await app.listen(5000);
}
bootstrap();
