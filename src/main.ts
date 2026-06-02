import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { loadBannedWords } from './seed/banned-words.seed';
import { loadSafetyWords } from './seed/safety_words.seed';
import { BannedWordsService } from './banned-words/banned-words.service';
import { loadTags } from './seed/tags.seed';
import { TagsService } from './tags/tags.service';

// Nestアプリを生成してHTTPサーバーを起動する
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const bannedWords = loadBannedWords();
  console.log(bannedWords);
  const bannedWordsService =
  app.get(BannedWordsService);
  await bannedWordsService.seedBannedWords(
    bannedWords,
  );

  const safetyWords = loadSafetyWords();
  console.log(safetyWords);
  await bannedWordsService.seedSafetyWords(
    safetyWords,
  );

  const tags = loadTags();
  console.log(tags);
  const tagsService =
  app.get(TagsService);
  await tagsService.seedTags(tags);

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
