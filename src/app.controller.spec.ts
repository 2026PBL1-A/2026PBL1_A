import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 概要: AppControllerのテスト
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    // テスト用モジュールを作成し、Controller/Serviceの依存関係を解決する
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    // テスト対象のControllerインスタンスを取得
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    // GET / が期待どおりの文字列を返すことを確認
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
