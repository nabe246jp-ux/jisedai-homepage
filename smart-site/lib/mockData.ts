// =============================================================
// モックデータ
// 後で Supabase / Google Sheets に差し替えやすいよう、
// すべてここに集約しています。
// 各 export の型を保ったままデータソースだけ差し替えてください。
// =============================================================

export type VisitorType = "new" | "existing" | "recruit";

export const company = {
  name: "株式会社サンプル",
  englishName: "Sample Inc.",
  tagline: "次世代型ホームページ「スマートサイト」",
  copy: "作って終わりのHPから、賢く動くスマートサイトへ。",
  subCopy: "会社の“今”を自動で伝える、次世代型ホームページ。"
};

// Smart Data: トップで自動表示する「会社の今の数字」
export type Metric = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  trend: "up" | "down" | "flat";
  delta: string;
  description: string;
};

export const metrics: Metric[] = [
  {
    id: "clients",
    label: "支援企業数",
    value: 1284,
    suffix: "社",
    trend: "up",
    delta: "+12%",
    description: "前年同月比で導入企業が増加中"
  },
  {
    id: "satisfaction",
    label: "顧客満足度",
    value: 98,
    suffix: "%",
    trend: "up",
    delta: "+1.2pt",
    description: "直近12ヶ月のNPS平均"
  },
  {
    id: "uptime",
    label: "稼働率",
    value: 99.98,
    suffix: "%",
    trend: "flat",
    delta: "安定",
    description: "365日24時間モニタリング"
  },
  {
    id: "members",
    label: "メンバー数",
    value: 312,
    suffix: "名",
    trend: "up",
    delta: "+24名",
    description: "今期新たに加わった仲間"
  }
];

// Smart Topics: お知らせ、プレス、導入事例などを横スクロールで流す
export type Topic = {
  id: string;
  category: "お知らせ" | "プレス" | "事例" | "ブログ";
  title: string;
  date: string;
  tag: string;
};

export const topics: Topic[] = [
  {
    id: "t1",
    category: "プレス",
    title: "スマートサイトが第3回DXアワードを受賞しました",
    date: "2026.05.08",
    tag: "受賞"
  },
  {
    id: "t2",
    category: "事例",
    title: "導入3ヶ月で問い合わせ2.4倍。製造業D社の事例公開",
    date: "2026.05.02",
    tag: "BtoB"
  },
  {
    id: "t3",
    category: "お知らせ",
    title: "夏季休業期間のお知らせ（8/13〜8/16）",
    date: "2026.04.28",
    tag: "営業"
  },
  {
    id: "t4",
    category: "ブログ",
    title: "“今”を伝えるサイトとは？──静的HPの限界と次世代設計",
    date: "2026.04.20",
    tag: "考察"
  },
  {
    id: "t5",
    category: "プレス",
    title: "シリーズBで12億円を調達、開発組織を倍増へ",
    date: "2026.04.10",
    tag: "資金調達"
  },
  {
    id: "t6",
    category: "事例",
    title: "求人サイト改修でエントリー数3倍。人材会社F社",
    date: "2026.04.02",
    tag: "採用"
  }
];

// 訪問者タイプごとのおすすめコンテンツ
export type Recommendation = {
  title: string;
  description: string;
  href: string;
  badge: string;
};

export const recommendations: Record<VisitorType, Recommendation[]> = {
  new: [
    {
      title: "3分で分かるスマートサイト",
      description: "従来HPとの違いと導入メリットを動画でご紹介",
      href: "#",
      badge: "イチオシ"
    },
    {
      title: "業界別 導入事例集",
      description: "あなたの業界に近い導入企業の成果をまとめました",
      href: "#",
      badge: "資料DL"
    },
    {
      title: "料金プランと比較表",
      description: "他社サービスと比較した強み・弱みを正直に公開",
      href: "#",
      badge: "比較"
    }
  ],
  existing: [
    {
      title: "新機能リリースノート",
      description: "今月追加された分析ダッシュボードのご案内",
      href: "#",
      badge: "新着"
    },
    {
      title: "活用テンプレート集",
      description: "他社が成果を出した運用パターンをそのまま使えます",
      href: "#",
      badge: "活用"
    },
    {
      title: "サポート窓口・コミュニティ",
      description: "担当チームと直接つながるチャネル一覧",
      href: "#",
      badge: "サポート"
    }
  ],
  recruit: [
    {
      title: "中途採用ポジション一覧",
      description: "現在募集中の全ポジションをまとめてチェック",
      href: "#",
      badge: "募集中"
    },
    {
      title: "社員インタビュー",
      description: "実際に働くメンバーが語る、入社の決め手と日常",
      href: "#",
      badge: "カルチャー"
    },
    {
      title: "選考フローと面談予約",
      description: "カジュアル面談から選考まで、その場で予約可能",
      href: "#",
      badge: "面談予約"
    }
  ]
};

// Smart Experience: マップ上に置く拠点／部署アイコン
export type ExperiencePoint = {
  id: string;
  label: string;
  x: number; // %
  y: number; // %
  category: "office" | "showroom" | "support" | "lab";
  description: string;
};

export const experiencePoints: ExperiencePoint[] = [
  {
    id: "hq",
    label: "本社オフィス",
    x: 28,
    y: 45,
    category: "office",
    description: "東京・大手町。経営／開発／営業の中枢拠点"
  },
  {
    id: "showroom",
    label: "ショールーム",
    x: 55,
    y: 30,
    category: "showroom",
    description: "実際の導入画面を体験できる常設スペース"
  },
  {
    id: "support",
    label: "サポートセンター",
    x: 72,
    y: 60,
    category: "support",
    description: "365日対応のカスタマーサポート拠点"
  },
  {
    id: "lab",
    label: "R&Dラボ",
    x: 42,
    y: 70,
    category: "lab",
    description: "AI・データ基盤の研究開発を担う部門"
  }
];

// 診断: 簡易フィット診断
export type DiagnosisQuestion = {
  id: string;
  question: string;
  options: { label: string; score: Record<string, number> }[];
};

export const diagnosis: DiagnosisQuestion[] = [
  {
    id: "q1",
    question: "現在のホームページで一番もったいないと思うことは？",
    options: [
      { label: "更新が止まっている", score: { content: 2, design: 0, lead: 1 } },
      { label: "問い合わせがほぼ来ない", score: { content: 0, design: 1, lead: 2 } },
      { label: "見た目が古い", score: { content: 0, design: 2, lead: 0 } }
    ]
  },
  {
    id: "q2",
    question: "サイトに期待する役割は？",
    options: [
      { label: "情報発信のハブ", score: { content: 2, design: 1, lead: 0 } },
      { label: "営業の最前線", score: { content: 0, design: 0, lead: 2 } },
      { label: "ブランドの顔", score: { content: 0, design: 2, lead: 0 } }
    ]
  },
  {
    id: "q3",
    question: "更新の体制は？",
    options: [
      { label: "社内で運用したい", score: { content: 2, design: 0, lead: 1 } },
      { label: "丸ごとお任せしたい", score: { content: 1, design: 1, lead: 1 } },
      { label: "とりあえず話を聞きたい", score: { content: 1, design: 1, lead: 1 } }
    ]
  }
];

export const diagnosisResults = {
  content: {
    title: "コンテンツ自動更新タイプ",
    headline: "“発信し続ける”サイトに進化させましょう",
    body: "御社は情報発信を強化することで成果が出やすいタイプです。Smart Topicsの自動収集とお知らせ自動配信が特に相性◎"
  },
  design: {
    title: "ブランド体験タイプ",
    headline: "“見た瞬間に伝わる”サイトを作りましょう",
    body: "御社はブランディング起点での改修が効きやすいタイプです。Smart Experienceマップやインタラクティブ演出で印象を一変できます。"
  },
  lead: {
    title: "問い合わせ獲得タイプ",
    headline: "“最前線の営業マン”に育てましょう",
    body: "御社は問い合わせ転換率の改善余地が大きいタイプです。診断・AIナビ・複数CTAの組み合わせで反応率を底上げできます。"
  }
} as const;

// AIナビ: チャット風の応答候補
export type AINaviTurn = {
  role: "user" | "ai";
  text: string;
  chips?: string[];
};

export const aiNaviScript: AINaviTurn[] = [
  {
    role: "ai",
    text: "こんにちは、サイトのご案内係です。何にご興味がありますか？",
    chips: ["料金が知りたい", "事例を見たい", "資料が欲しい", "採用情報"]
  }
];

export const aiNaviAnswers: Record<string, AINaviTurn[]> = {
  料金が知りたい: [
    {
      role: "user",
      text: "料金が知りたい"
    },
    {
      role: "ai",
      text: "プランは3種類あります。会社規模をお選びください。",
      chips: ["〜50名", "50〜300名", "300名以上"]
    }
  ],
  事例を見たい: [
    { role: "user", text: "事例を見たい" },
    {
      role: "ai",
      text: "業界をお選びください。近い事例をピックアップします。",
      chips: ["製造業", "IT・SaaS", "小売", "人材"]
    }
  ],
  資料が欲しい: [
    { role: "user", text: "資料が欲しい" },
    {
      role: "ai",
      text: "メールアドレスをお送りいただければ、すぐに資料をお送りします。下のフォームからどうぞ。",
      chips: ["フォームへ"]
    }
  ],
  採用情報: [
    { role: "user", text: "採用情報" },
    {
      role: "ai",
      text: "ご興味のある職種は？",
      chips: ["エンジニア", "デザイナー", "ビジネス", "コーポレート"]
    }
  ]
};

// Before / After
export const beforeAfterItems = [
  {
    title: "更新の仕組み",
    before: "誰かが手で更新するまで止まったまま",
    after: "社内データから自動で“今”を反映"
  },
  {
    title: "訪問者への対応",
    before: "誰が来ても同じ画面",
    after: "訪問者タイプ別に最適なコンテンツを出し分け"
  },
  {
    title: "問い合わせ導線",
    before: "ページ最下部のフォームのみ",
    after: "AIナビ、診断、複数CTAで反応率を底上げ"
  },
  {
    title: "改善のスピード",
    before: "依頼→見積→納品で数週間",
    after: "管理画面から即時反映"
  }
];
