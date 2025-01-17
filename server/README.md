➀GiikuCamp20 - PostgreSQL Docker 構築手順 & テーブル追加手順

Docker 起動方法
→DockerDesktop 開いてください
→server ディレクトリに移動

docker-compose up -d

テーブル追加したいとき

psql -h localhost -p 5435 -U giikucamp20 -d giikucamp20

→ ここで Create 文で追加

# プロジェクト

このプロジェクトは、フロントエンド（React/Next.js）とバックエンド（Go/Gin + PostgreSQL）で構成されたWebアプリケーションです。以下の手順に従ってセットアップと実行を行ってください。

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

4. ブラウザで以下のURLにアクセスしてください。
   ```
   http://localhost:3000
   ```

---

### 2. バックエンドのセットアップ

1. プロジェクトディレクトリに移動します。
   ```bash
   cd server
   ```

2. Dockerを使用してデータベースを起動します。
   ```bash
   docker-compose up -d
   ```

3. 環境変数 `GO_ENV` を設定します（Windowsの場合）。
   ```bash
   set GO_ENV=dev
   ```

4. メインサーバーを起動します。
   ```bash
   go run .
   ```

5. データベースのマイグレーションを実行します。
   ```bash
   go run migrate/migrate.go
   ```

6. サーバーが正常に起動した場合、以下のURLにアクセスできます。
   ```
   http://localhost:8080
   ```

---

## 開発のヒント

- **環境変数が読み込まれない場合**:
  `.env` ファイルが正しいディレクトリに存在していることを確認してください。

- **データベース接続に失敗する場合**:
  `docker-compose up -d` でPostgreSQLが正常に起動しているか確認してください。

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


