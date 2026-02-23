# レシグル (Recigle)

レシピ検索時に素人レシピサイト・個人ブログ・動画サイトを除外して検索できる Web アプリ

## 技術スタック

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Serwist** (PWA)
- **Biome** (Linter / Formatter)

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

## 開発コマンド

```bash
npm run dev          # 開発サーバー
npm run build        # ビルド
npm run start        # プロダクションサーバー
npm run lint         # リント
npm run check        # リント + 自動修正
npm run format       # フォーマット
npm run typecheck    # 型チェック
npm run knip         # 未使用コード検出
npm run secretlint   # シークレット検出
```

## ディレクトリ構成

```txt
src/
├── app/
│   ├── _components/  # ページ固有コンポーネント
│   ├── api/suggest/  # Google Suggest プロキシ
│   └── serwist/      # Service Worker ルート
├── hooks/            # カスタムフック
└── lib/              # ユーティリティ
```
