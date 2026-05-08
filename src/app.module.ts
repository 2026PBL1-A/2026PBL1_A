import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ProfileModule } from './profile/profiles.module';
import { QuestionsModule } from './questions/questions.module';

// 環境変数を安全に数値へ変換する
const dbPort = Number(process.env.DB_PORT ?? 3306);
// true のときのみテーブル自動同期を有効化する
const shouldSynchronize = (process.env.DB_SYNCHRONIZE ?? 'false') === 'true';

// アプリ全体のモジュール設定
@Module({
  imports: [
    // MySQL接続設定。値は .env から取得する
    ConfigModule.forRoot({
      isGlobal: true, // どこからでも環境変数にアクセス可能にする
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: dbPort,
      username: process.env.DB_USER ?? 'user',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'my_app_db',
      autoLoadEntities: true,
      synchronize: shouldSynchronize,
    }),
    // ユーザー関連APIを提供するモジュール
    UserModule,
    // 認証関連APIを提供するモジュール
    AuthModule,
    // コメント関連APIを提供するモジュール
    CommentModule,
    // プロフィール関連APIを提供するモジュール
    ProfileModule,
    // 投稿関連APIを提供するモジュール]
    PostsModule,
    // 質問関連APIを提供するモジュール
    QuestionsModule,
  ],
})
export class AppModule {}