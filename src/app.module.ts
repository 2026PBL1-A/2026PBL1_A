import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'mydb',
      autoLoadEntities: true,
      synchronize: true,  // 本番では絶対NGらしいです（DB壊れる可能性）
    }),
    UserModule,
  ],
})
export class AppModule {}