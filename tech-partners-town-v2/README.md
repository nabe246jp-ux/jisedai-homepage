# Tech Partners Town v2 — 自律型動的ホームページ（デモ版）

街の中心にそびえる時計台が秒まで時を刻み、月が変われば季節装飾が舞い、
数字は息づくように更新される。ホームページではなく「町」として体験する次世代Webサイト。

## はじめかた

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## 構成

- Next.js 14 (App Router)
- React Three Fiber + drei + postprocessing で 3D 表現
- Tailwind CSS で HUD レイアウト
- Framer Motion でアニメーション
- zustand で軽量な状態管理

## 主要機能

- 中央の時計台（実時刻、4面文字盤、時刻に応じた発光）
- 月ごとの季節背景・粒子（桜・葉・雪・蛍・雨）
- 時間帯による空・光・街灯の自動変化
- KPIボード（25秒ごと自動更新＋手動更新ボタン）
- 妖精「ルミナ」による会話パネル
- マウス追従カメラ・カスタムカーソル
- ポストエフェクト（Bloom + Vignette）

## ファイル構成

- `app/` — Next.js App Router のページ
- `components/` — UI / 3D コンポーネント
- `lib/` — 季節・時刻・状態管理のユーティリティ
