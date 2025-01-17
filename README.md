# エンジニアマッチングアプリ

---

チーム名：Khaos Matching

制作物概要

近くにいるエンジニア同士がチャットルームで交流を楽しむためのマッチングアプリです。このアプリを通じて、新しいつながりを作り、エンジニア間の情報交換やコラボレーションの場を提供します。

---

## 必要なツール

このプロジェクトをローカル環境で実行するには、以下のツールが必要です。

- [Node.js](https://nodejs.org/)（推奨バージョン: 最新 LTS）
- [Docker](https://www.docker.com/)
- [Go](https://go.dev/)（バージョン: 1.20+）

---

## 環境変数の設定

### フロントエンド (`client/.env`)

以下の内容を `client/.env` ファイルに記載してください。

```env
API_URL=http://localhost:8080
```

### バックエンド (`server/.env`)

以下の内容を `server/.env` ファイルに記載し、必要箇所を記入してください。

```env
AWS_ACCESS_KEY_ID=アクセスキー
AWS_SECRET_ACCESS_KEY=シークレットアクセスキー
AWS_REGION=リージョン
S3_BUCKET=S3バケット名
GO_ENV=dev
SECRET=シークレット
API_DOMAIN=localhost
DB_HOST=localhost
DB_PORT=5435
DB_USER=giikucamp
DB_PASSWORD=camppass
DB_NAME=giikucamp
```

---

## 実行手順

### 1. フロントエンドのセットアップ

1. プロジェクトディレクトリに移動します。

   ```bash
   cd client
   ```

2. 必要な依存関係をインストールします。

   ```bash
   npm install
   ```

3. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

4. ブラウザで以下の URL にアクセスしてください。
   ```
   http://localhost:3000
   ```

---

### 2. バックエンドのセットアップ

1. プロジェクトディレクトリに移動します。

   ```bash
   cd server
   ```

2. Docker を使用してデータベースを起動します。

   ```bash
   docker-compose up -d
   ```

3. 環境変数 `GO_ENV` を設定します（Windows の場合）。

   ```bash
   set GO_ENV=dev
   ```

4. メインサーバーを起動します。

   ```bash
   go run .
   ```

5. データベースのマイグレーションを実行します。

   ```bash
   go run migrate/migrate.go /.env
   ```

6. サーバーが正常に起動した場合、以下の URL にアクセスできます。
   ```
   http://localhost:8080
   ```

---

## 開発のヒント

- **環境変数が読み込まれない場合**:
  `.env` ファイルが正しいディレクトリに存在していることを確認してください。

- **データベース接続に失敗する場合**:
  `docker-compose up -d` で PostgreSQL が正常に起動しているか確認してください。

---

## ディレクトリ構成

```
project-root/
├── client/                # フロントエンドコード
│   ├── .env              # フロントエンドの環境変数
│   ├── package.json
│   └── ...
├── server/                # バックエンドコード
│   ├── .env              # バックエンドの環境変数
│   ├── migrate/          # マイグレーション関連コード
│   ├── model/            # モデル定義
│   ├── router/           # ルーター設定
│   └── ...

```

---
