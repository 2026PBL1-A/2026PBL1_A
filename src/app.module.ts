import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

const dbPort = Number(process.env.DB_PORT ?? 3306);
const shouldSynchronize = (process.env.DB_SYNCHRONIZE ?? 'false') === 'true';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: dbPort,
      username: process.env.DB_USER ?? 'user',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'mydb',
      autoLoadEntities: true,
      synchronize: shouldSynchronize,
    }),
    UserModule,
  ],
})
export class AppModule {}