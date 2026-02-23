# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

**レシグル (Recigle)** — レシピ検索時に素人レシピサイト・個人ブログ・動画サイトを除外して検索できるWebアプリ

- **検索エンジン**: DuckDuckGo（`-site:` 演算子でブラックリストのドメインを除外）
- **ブラックリスト**: Google Sheets から CSV で取得（ISR 24時間キャッシュ）
- **サジェスト**: Google Suggest API（Shift_JIS デコード対応）
- **フレームワーク**: Next.js 15 (App Router, Turbopack)
- **UI**: Tailwind CSS v4
- **言語**: TypeScript (strict mode)
- **リンター/フォーマッター**: Biome
- **PWA**: Serwist（Service Worker, オフライン対応）

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run lint         # Biome によるリント
npm run check        # Biome による自動修正
npm run format       # Biome によるフォーマット
npm run typecheck    # TypeScript 型チェック
npm run knip         # 未使用コード検出
npm run secretlint   # シークレット検出
```

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx            # ルートレイアウト（metadata, フォント）
│   ├── page.tsx              # トップページ（async Server Component）
│   ├── globals.css           # Tailwind v4 + カスタムテーマ
│   ├── manifest.ts           # PWAマニフェスト
│   ├── sw.ts                 # Service Worker
│   ├── serwist/[path]/       # Serwist ルート
│   ├── _components/          # ページ固有コンポーネント
│   │   ├── button.tsx
│   │   ├── heading.tsx
│   │   ├── search-form.tsx
│   │   ├── search-input.tsx
│   │   ├── suggestion-item.tsx
│   │   ├── suggestions-dropdown.tsx
│   │   └── serwist-provider.tsx
│   └── api/
│       └── suggest/
│           └── route.ts      # Google Suggest プロキシ
├── hooks/
│   ├── use-local-storage.ts  # localStorage 永続化
│   ├── use-search-history.ts # 検索履歴管理
│   └── use-suggestions.ts   # サジェスト取得 + デバウンス
└── lib/
    ├── build-search-url.ts   # DuckDuckGo 検索URL組み立て
    └── fetch-blacklist.ts    # Google Sheets CSV からブラックリスト取得
```

## コーディング規約

### 命名規則

- **ファイル名**: kebab-case（`search-form.tsx`）
- **変数・関数**: camelCase
- **型**: PascalCase（`type` を使用、`interface` は使わない）

### インポート

- `@/` エイリアスを使用（`src/` を指す）
- 型のみのインポートは `import type` を使用
- インポートは Biome により自動でソートされる

### コンポーネント

- 戻り値の型は明示的に `: ReactNode` を記述
- ページ固有のコンポーネントは `_components/` に配置
- ページコンポーネント（`page.tsx`）は Server Component とする

### PWA

- `src/app/manifest.ts` — PWAマニフェスト
- `src/app/sw.ts` — Service Worker
- `src/app/serwist/[path]/route.ts` — Serwist ルート
- `src/app/_components/serwist-provider.tsx` — SerwistProvider

## Git フック

Lefthook により pre-commit で以下が実行されます：

- Biome（リント＆フォーマット＆自動修正）
- TypeScript 型チェック
- Secretlint（シークレット検出）

コミットメッセージは Conventional Commits 形式に従ってください：

```
feat: 新機能を追加
fix: バグ修正
docs: ドキュメントのみの変更
style: コードの意味に影響しない変更
refactor: バグ修正でも機能追加でもないコード変更
test: テストの追加・修正
chore: ビルドプロセスやツールの変更
```
