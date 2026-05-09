# Smart Site (スマートサイト) MVP

次世代型ホームページ「スマートサイト」のMVPです。Next.js 14 + React + Tailwind CSS + Framer Motion で作成しています。

## はじめかた

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 構成

```
smart-site/
├── app/                # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx        # トップページ（全セクションを束ねる）
│   └── globals.css
├── components/         # セクションごとのコンポーネント
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── VisitorTypeSelector.tsx
│   ├── SmartData.tsx
│   ├── SmartTopics.tsx
│   ├── SmartExperience.tsx
│   ├── Diagnosis.tsx
│   ├── AINavi.tsx
│   ├── BeforeAfter.tsx
│   ├── ContactCTA.tsx
│   ├── Footer.tsx
│   └── FloatingCTA.tsx
├── lib/
│   └── mockData.ts     # 仮データ（後でSupabase等に置き換え）
└── ...
```

## データ連携の差し替え方

すべての仮データは `lib/mockData.ts` に集約しています。
将来的に Supabase や Google Sheets と連携する場合、各 export の **型を保ったまま** データソースを差し替えれば、コンポーネント側を変更せずに本番データへ切り替えられます。
