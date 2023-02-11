# memo

## setup

```sh
docker compose exec app npm install --save-dev typescript @types/express @types/node
docker compose exec app npx tsc --init
```

## やりたいこと

- おおまかにこんなことをしたい
  - Google Driveへの特定のフォルダへのファイルアップロードをトリガーに、そのファイルをgithubリポジトリにコミットしたい
    - Google Driveへのアップロードをトリガーにすることはできるのか
    - Google Drive からCloud Strageにアップロードするスクリプトを書く
- 流れ
  - Google Driveへの特定のフォルダへのファイルアップロードをトリガーにPub/SubにメッセージをPublishする
  - Pub/SubへメッセージがPublishされたことを契機にCloud Runを動かす
  - Cloud Runでは以下の処理を行う
    - Google Driveにアップロードされたデータ(おそらくPDF)を取得する
    - PDFからOCRを使って文字認識する
    - その文字からテキストファイルを作成する
    - 作成したテキストファイルをgithubリポジトリにpushする
- タブレットでメモとったりするけどこれもgithubで管理できたら嬉しい
- 字が汚いので、あとで見返すのがつらい
- 手書き文字をOCRでいい感じにテキストデータに変換して保存してくれたら嬉しい
- なんかできそうではある

## メモ

- 楽なのはrubyだけどどうしよう違う言語で書こうかどうか
- 図も書きたい
  - mermaid
  - https://qiita.com/fetaro/items/c8420f5de48f48317391
  - https://www.infoq.com/jp/articles/why-architectural-diagrams/
- xxx

## ドキュメント

- https://developers.google.com/drive/api/guides/push
- https://cloud.google.com/storage/docs/pubsub-notifications?hl=ja
- https://cloud.google.com/run/docs/triggering/pubsub-push?hl=ja
- https://cloud.google.com/run/docs?hl=ja
