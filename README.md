# タスク管理アプリケーション - バックエンド

## 概要

このリポジトリは、タスク管理アプリケーションのバックエンド部分を管理します。NestJSを使用して構築されており、セキュアなユーザー認証、タスク管理、およびデータベース操作を提供します。JWTによる認証により、ユーザーのデータを安全に管理し、各ユーザーのタスクを個別に保持します。また、新規ユーザーの登録機能も備えており、ユーザーが簡単にアカウントを作成できます。

## 機能

- **ユーザー登録:** 新しいユーザーがアカウントを作成できます。
- **ユーザー認証:** JWTを使用したセキュアな登録、ログイン、ログアウト機能。
- **タスク管理:** タスクの作成、表示、更新、削除機能。
- **APIドキュメンテーション:** Swaggerを使用して自動生成されたAPIドキュメントを提供。

## 技術スタック

- **バックエンド:** NestJS, TypeORM, Swagger, Passport-JWT。
- **データベース:** PostgreSQL。
- **デプロイ:** Google Cloud Run, Docker, GitHub Actions。

## セットアップ手順

### 前提条件

- Node.js および npm がインストールされていること。
- PostgreSQLデータベースがセットアップされていること。
- デプロイのためのGoogle Cloud SDK。

### リポジトリをクローン

```
git clone https://github.com/Dip11/medic-media-coding-test-backend.git
cd medic-media-coding-test-backend
```

### 依存関係をインストール

```
npm install
```


### 環境変数

ルートディレクトリに .env ファイルを作成し、次の内容を追加してください:

```
ENVIRONMENT=development
_PORT=8080
DATABASE_HOST=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_PORT=
JWT_KEY=dev
JWT_EXPIRES=365d
```

### データベースのマイグレーション

アプリケーションを起動する前に、以下のコマンドを実行してデータベースをマイグレートしてください:

```
npm run migration:run
```

### アプリケーションの起動
```
npm run dev
```

アプリケーションは http://localhost:8080 で利用可能です。

## デプロイ手順

### アプリケーションのDocker化
プロジェクトにはすでに Dockerfile が含まれているため、新しいものを作成する必要はありません。

### Dockerイメージのビルドとプッシュ
```
docker build -t gcr.io/your-project-id/task-backend .
```

### Google Cloud Runへのデプロイ
```
gcloud run deploy task-backend \
  --image gcr.io/your-project-id/task-backend \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

## CI/CDセットアップ

CI/CDパイプラインはGitHub Actionsを使用して設定されています。ワークフローファイルは .github/workflows/google-cloudrun-docker.yml に配置されています。

### Google Cloud 認証のためのリポジトリシークレット
サービスアカウントの作成と権限設定
1. GCPのIAMでサービスアカウントを作成します。
2. 以下の権限を付与します:
* Cloud Run:
  - roles/run.admin
  - roles/iam.serviceAccountUser
* Artifact Registry:
  - roles/artifactregistry.admin

3. このサービスアカウントのキーを作成し、JSON形式でダウンロードします。
4. このキーをGitHubリポジトリのシークレットとしてGCP_CREDENTIALSという名前で追加します。

### ファイル内の次のセクションを更新してください:
```
env:
  PROJECT_ID: your-google-cloud-project-id # Google CloudプロジェクトIDを更新
  GAR_NAME: your-artifact-registry-name # Artifact Registry名を更新
  GAR_LOCATION: asia-northeast1 # Artifact Registryの場所を確認または更新
  SERVICE: your-cloud-run-service-name # Cloud Runサービス名を更新
  REGION: asia-northeast1 # Cloud Runサービスのリージョンを確認または更新
```

## 監視
デプロイプロセスはGitHub ActionsまたはGCPコンソールで監視できます。デプロイが完了すると、アプリケーションはGoogle Cloud Run上で稼働します。


