import { Injectable } from '@nestjs/common';

// AppControllerから呼び出されるシンプルな業務ロジック
@Injectable()
export class AppService {
  // 動作確認用の固定メッセージ
  getHello(): string {
    return 'Hello World!';
  }
}
