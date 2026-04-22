# 📦 2026PBL1_A Backend

NestJS + TypeORM + MySQL を使用したバックエンドAPIです。
チーム開発用の運用ドキュメントを兼ねています。

---

## 🧰 技術スタック

* NestJS
* TypeORM
* MySQL 8.0（Docker）
* Jest

---

## 🚀 セットアップ & 起動手順

### ① 依存関係インストール

```bash
npm install
```

### ② MySQL起動（Docker）

```bash
docker compose up -d
```

### ③ APIサーバー起動

```bash
npm run start:dev
```

👉 起動URL
http://localhost:5000

---

## ⚠️ 事前に確認すること

* Docker が起動していること
* 3306ポートが使用可能であること
* 5000ポートが使用可能であること

---

## 🗄 DB接続設定

設定ファイル：`src/app.module.ts`

```ts
TypeOrmModule.forRoot({
  host: 'localhost',
  port: 3306,
  username: 'user',
  password: 'password',
  database: 'mydb',
  autoLoadEntities: true,
  synchronize: true,
})
```

### ⚠️ 注意

* `synchronize: true` は開発専用
* 本番では必ず `false` + マイグレーション管理にすること

---

## 📁 ディレクトリ構成（主要）

```bash
src/
├── user/
│   ├── entities/
│   ├── dto/
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
```

---

## 🧩 現在のAPI一覧

ベースパス：`/user`

| Method | Path       | 内容     |
| ------ | ---------- | ------ |
| POST   | /user      | ユーザー作成 |
| GET    | /user      | 一覧取得   |
| GET    | /user/:id  | 詳細取得   |
| PATCH  | /user/:id  | 更新     |
| DELETE | /user/:id  | 削除     |
| POST   | /user/seed | 仮データ投入 |

---

## 🧪 動作確認（PowerShell）

### 仮データ投入

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/user/seed
```

### 一覧取得

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/user
```

### ユーザー作成

```powershell
$body = @{
  name = "Test User"
  email = "test@example.com"
  password = "pass1234"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/user `
  -ContentType "application/json" `
  -Body $body
```

---

## 🛠 開発ルール（重要）

### テーブル追加時

例：Product

**作成するファイル**

* entity
* dto（create/update）
* service
* controller
* module

**変更する可能性あり**

* `app.module.ts`
* テストコード

---

### API追加時

例：ログイン機能

* controller：ルート追加
* service：ロジック追加
* dto：新規作成

---

### 認証機能を導入する場合

新規ディレクトリ：

```bash
src/auth/
```

主な構成：

* module
* controller
* service
* jwt.strategy
* guard

---

## 🔐 セキュリティ注意

現在は開発用のため簡易実装です。

本番前に必ず対応すること：

* bcryptでパスワードをハッシュ化
* passwordをレスポンスに含めない
* emailにユニーク制約
* バリデーション追加

---

## 🧪 テスト

```bash
npm run test
npm run test:e2e
```

---

## 📝 補足

* DB構造変更時はチームに共有すること
* READMEは随時更新してください
