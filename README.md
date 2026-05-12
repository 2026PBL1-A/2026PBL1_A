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
docker compose down -v
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
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'user',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME ?? 'mydb',
  charset: 'utf8mb4',
  autoLoadEntities: true,
  synchronize: (process.env.DB_SYNCHRONIZE ?? 'false') === 'true',
  timezone: 'Z',
})
```

MySQLへ接続するときの文字コード指定
```bash
docker exec -it mysql_db mysql --default-character-set=utf8mb4 -u root -p
```

### ⚠️ 注意

* 既定値は `DB_SYNCHRONIZE=false`（自動同期オフ）
* `synchronize: true` は開発専用
* 本番では必ず `false` + マイグレーション管理にすること

### `.env` の準備

`.env.example` をコピーして `.env` を作成してください（`.env` は Git 管理対象外）。

```powershell
Copy-Item .env.example .env
```

```bash
cp .env.example .env
```

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

ベースパス：`/auth`, `/user`, `/profiles`, `/posts`

### 認証

| Method | Path        | 内容        |
| ------ | ----------- | --------- |
| POST   | /auth/login | ログインしてJWT取得 |

### ユーザー

| Method | Path       | 内容     |
| ------ | ---------- | ------ |
| POST   | /user      | ユーザー作成 |
| GET    | /user      | 一覧取得（JWT必須） |
| GET    | /user/:id  | 詳細取得（JWT必須） |
| PATCH  | /user/:id  | 更新（JWT必須） |
| DELETE | /user/:id  | 削除（JWT必須） |
| POST   | /user/seed | 仮データ投入 |

### プロフィール

| Method | Path           | 内容         |
| ------ | -------------- | ---------- |
| POST   | /profiles      | 作成（JWT必須） |
| GET    | /profiles      | 一覧取得 |
| GET    | /profiles/:id  | 詳細取得 |
| PATCH  | /profiles      | 更新（JWT必須） |
| PATCH  | /profiles/password | パスワード更新（JWT必須） |
| GET    | /profiles/:id/posts | プロフィール属性ユーザーの投稿一覧取得 |
| GET    | /profiles/:id/questions | プロフィール属性ユーザーの質問一覧取得 |

### 投稿

| Method | Path       | 内容     |
| ------ | ---------- | ------ |
| POST   | /posts     | 新規作成（JWT必須） |
| GET    | /posts     | 一覧取得 |
| GET    | /posts/:id | 詳細取得 |
| GET    | /posts/seed | 仮データ投入 |

### タグ

| Method | Path | 内容 |
| ------ | ---- | ---- |
| POST | /tags | タグ新規作成 |
| POST | /tags/seed | 仮データ投入 |
| GET | /tags | 一覧取得 |
| GET | /tags/ids?ids=id1,id2 | 複数IDで取得 |
| GET | /tags/search?tag=name | タグ名で検索 |
| GET | /tags/:id | 1件取得 |

---

## 🧪 動作確認（PowerShell）

### 仮データ投入

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/user/seed
```

### ログイン（JWT取得）

```powershell
$loginBody = @{
  email = "taro@example.com"
  password = "pass1234"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/auth/login `
  -ContentType "application/json" `
  -Body $loginBody

$token = $loginRes.access_token
```

### 一覧取得

```powershell
Invoke-RestMethod -Method Get `
  -Uri http://localhost:5000/user `
  -Headers @{ Authorization = "Bearer $token" }
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

### ユーザー更新（JWT必須）

```powershell
$updateBody = @{
  name = "Updated User"
} | ConvertTo-Json

Invoke-RestMethod -Method Patch `
  -Uri http://localhost:5000/user/<id> `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $updateBody
```

### ユーザー削除（JWT必須）

```powershell
Invoke-RestMethod -Method Delete `
  -Uri http://localhost:5000/user/<id> `
  -Headers @{ Authorization = "Bearer $token" }
```

### プロフィール一覧取得

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/profiles
```

### プロフィール詳細取得

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/profiles/<profileId>
```

### プロフィール更新（JWT必須）

```powershell
$updateBody = @{
  username = "Updated User"
  bio = "新しい自己紹介"
} | ConvertTo-Json

Invoke-RestMethod -Method Patch `
  -Uri http://localhost:5000/profiles `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $updateBody
```

### パスワード更新（JWT必須）

`newPassword` は 8文字以上、`newPassword` と `confirmPassword` は一致させてください。

```powershell
$passwordBody = @{
  currentPassword = "password123"
  newPassword = "newpassword456"
  confirmPassword = "newpassword456"
} | ConvertTo-Json

Invoke-RestMethod -Method Patch `
  -Uri http://localhost:5000/profiles/password `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $passwordBody
```

### プロフィールのユーザー投稿取得

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/profiles/<profileId>/posts
```

### 投稿一覧取得

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/posts
```

### 投稿詳細取得

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/posts/<postId>
```

### 投稿作成（JWT必須、タグなし）

```powershell
$postBody = @{
  title = "タイトル"
  content = "本文内容"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/posts `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $postBody
```

### 投稿作成（JWT必須、タグ複数指定）

```powershell
$postBody = @{
  title = "タイトル（タグ付き）"
  content = "本文内容（タグ付き）"
  tag_ids = @("uuid-1", "uuid-2")
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/posts `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $postBody
```

### 投稿仮データ投入

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/posts/seed
```

### 質問作成（JWT必須、タグなし）

```powershell
$questionBody = @{
  title = "質問タイトル"
  content = "質問本文"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/questions `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $questionBody
```

### 質問作成（JWT必須、タグ複数指定）

```powershell
$questionBody = @{
  title = "質問タイトル（タグ付き）"
  content = "質問本文（タグ付き）"
  tag_ids = @("uuid-1", "uuid-2")
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/questions `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $questionBody
```

### 質問詳細取得（タグ情報込み）

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/questions/<questionId>
```

### タグ作成

```powershell
$tagBody = @{
  tag = "nestjs"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/tags `
  -ContentType "application/json" `
  -Body $tagBody
```

### タグ仮データ投入

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/tags/seed
```

### タグ一覧取得

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/tags
```

### タグ検索

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/tags/search?tag=nestjs
```





## 🧪 動作確認（macOS / zsh）

### 仮データ投入

```bash
curl -X POST http://localhost:5000/user/seed
```

### ログイン（JWT取得）

```bash
LOGIN_RES=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"taro@example.com","password":"pass1234"}')

TOKEN=$(echo "$LOGIN_RES" | sed -E 's/.*"access_token":"([^"]+)".*/\1/')
echo "$TOKEN"
```

### 一覧取得

```bash
curl -X GET http://localhost:5000/user \
  -H "Authorization: Bearer $TOKEN"
```

### ユーザー作成

```bash
curl -X POST http://localhost:5000/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"pass1234"}'
```

### ユーザー更新（JWT必須）

```bash
curl -X PATCH http://localhost:5000/user/<id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated User"}'
```

### ユーザー削除（JWT必須）

```bash
curl -X DELETE http://localhost:5000/user/<id> \
  -H "Authorization: Bearer $TOKEN"
```

### プロフィール一覧取得

```bash
curl -X GET http://localhost:5000/profiles
```

### プロフィール詳細取得

```bash
curl -X GET http://localhost:5000/profiles/<profileId>
```

### プロフィール更新（JWT必須）

```bash
curl -X PATCH http://localhost:5000/profiles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"Updated User","bio":"新しい自己紹介"}'
```

### パスワード更新（JWT必須）

`newPassword` は 8文字以上、`newPassword` と `confirmPassword` は一致させてください。

```bash
curl -X PATCH http://localhost:5000/profiles/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"password123","newPassword":"newpassword456","confirmPassword":"newpassword456"}'
```

### プロフィールのユーザー投稿取得

```bash
curl -X GET http://localhost:5000/profiles/<profileId>/posts
```

### 投稿一覧取得

```bash
curl -X GET http://localhost:5000/posts
```

### 投稿詳細取得

```bash
curl -X GET http://localhost:5000/posts/<postId>
```

### 投稿作成（JWT必須、タグなし）

```bash
curl -X POST http://localhost:5000/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"タイトル","content":"本文内容"}'
```

### 投稿作成（JWT必須、タグ複数指定）

```bash
curl -X POST http://localhost:5000/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"タイトル","content":"本文内容","tag_ids":["uuid-1","uuid-2"]}'
```

### 投稿仮データ投入

```bash
curl -X GET http://localhost:5000/posts/seed
```

### 質問作成（JWT必須、タグなし）

```bash
curl -X POST http://localhost:5000/questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"質問タイトル","content":"質問本文"}'
```

### 質問作成（JWT必須、タグ複数指定）

```bash
curl -X POST http://localhost:5000/questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"質問タイトル（タグ付き）","content":"質問本文（タグ付き）","tag_ids":["uuid-1","uuid-2"]}'
```

### 質問詳細取得（タグ情報込み）

```bash
curl -X GET http://localhost:5000/questions/<questionId>
```

### タグ作成

```bash
curl -X POST http://localhost:5000/tags \
  -H "Content-Type: application/json" \
  -d '{"tag":"nestjs"}'
```

### タグ仮データ投入

```bash
curl -X POST http://localhost:5000/tags/seed
```

### タグ一覧取得

```bash
curl -X GET http://localhost:5000/tags
```

### タグ検索

```bash
curl -X GET "http://localhost:5000/tags/search?tag=nestjs"
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

現在は開発用の設定を含みますが、以下は実装済みです。

* bcryptでパスワードをハッシュ化
* passwordを通常レスポンスに含めない
* emailにユニーク制約
* DTOバリデーション（class-validator）

本番前に追加で必ず対応すること：

* JWT_SECRETを強固な値にし、環境変数で管理
* DBマイグレーション運用（`DB_SYNCHRONIZE=false`）
* CORS許可オリジンの明示設定

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
