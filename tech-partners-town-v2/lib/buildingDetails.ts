/**
 * 各建物の詳細データ。HTML オーバーレイの BuildingDetail から参照される。
 *
 * - 4つの建物 = 4つのトピック
 * - 各トピックに 6〜8枚のカードがあり、カード単位でさらに詳細が開かれる
 */

import type { BuildingKey } from "./store";

export type Card = {
  key: string;
  title: string;
  subtitle: string;
  tag: string;        // 右上の小さなタグ（区分名）
  accent: string;     // カード上端のアクセント色
  bullet: string;     // カードに表示する短い見出し（説明1〜2行）
  sections: { heading: string; lines: string[] }[]; // クリック時に開く3列分のセクション
};

export type BuildingInfo = {
  key: BuildingKey;
  title: string;
  subtitle: string;
  description: string;
  // 建物カラー（背景グラデのアクセント）
  hue: string;
  cards: Card[];
};

export const buildingInfos: Record<BuildingKey, BuildingInfo> = {
  training: {
    key: "training",
    title: "研修について",
    subtitle: "TRAINING & CERTIFICATION CENTER",
    description:
      "AWS / Azure / Cisco の認定講師が在籍するハンズオン研修施設。新人からベテランまで、現場で使える実務スキルを段階的に積み上げます。",
    hue: "#6c7a93",
    cards: [
      {
        key: "aws-foundation",
        title: "AWS 基礎",
        subtitle: "Cloud Practitioner / Solutions Architect Associate 対応",
        tag: "AWS",
        accent: "#ff9900",
        bullet: "クラウドの基本から構築実習まで、3週間の集中コース",
        sections: [
          {
            heading: "学べる内容",
            lines: [
              "EC2 / S3 / VPC の基本",
              "IAM とセキュリティ設計",
              "RDS / DynamoDB の使い分け",
              "監視とコスト最適化",
            ],
          },
          {
            heading: "進め方",
            lines: [
              "午前 講義 90分",
              "午後 ハンズオン 4時間",
              "毎週末に小テスト",
              "最終日に模擬試験",
            ],
          },
          {
            heading: "受講対象",
            lines: [
              "入社1〜3年目",
              "他職種からの異動者",
              "事前学習 不要",
              "受講料 全額会社負担",
            ],
          },
        ],
      },
      {
        key: "aws-advanced",
        title: "AWS 応用",
        subtitle: "Professional 認定 / 大規模設計",
        tag: "AWS",
        accent: "#ff9900",
        bullet: "ECS / EKS / Lambda を組み合わせた本番設計を学ぶ",
        sections: [
          {
            heading: "テーマ",
            lines: [
              "マイクロサービス設計",
              "サーバーレスの落とし穴",
              "災害復旧 / マルチリージョン",
              "コストガバナンス",
            ],
          },
          {
            heading: "成果物",
            lines: [
              "個人で1サービス設計",
              "全体レビュー会",
              "改善版を再提出",
              "設計書はWiki公開",
            ],
          },
          {
            heading: "条件",
            lines: [
              "Associate 取得済み",
              "実務2年以上",
              "全6週間",
              "週2日 出社推奨",
            ],
          },
        ],
      },
      {
        key: "azure",
        title: "Azure 設計",
        subtitle: "AZ-104 / AZ-305 対応",
        tag: "Azure",
        accent: "#0078d4",
        bullet: "M365連携を含む企業向け Azure 設計を体得",
        sections: [
          {
            heading: "学べる内容",
            lines: [
              "Entra ID と認証",
              "VNet / ExpressRoute",
              "AKS と App Service",
              "Defender for Cloud",
            ],
          },
          {
            heading: "演習",
            lines: [
              "ハイブリッド構成構築",
              "オンプレ移行シミュレーション",
              "ゼロトラスト設計",
              "ログ分析 (Sentinel)",
            ],
          },
          {
            heading: "実績",
            lines: [
              "年間120名 受講",
              "合格率 87%",
              "講師 全員MVP経験者",
              "再受験 全額補助",
            ],
          },
        ],
      },
      {
        key: "cisco",
        title: "Cisco ネットワーク",
        subtitle: "CCNA / CCNP 取得支援",
        tag: "Cisco",
        accent: "#1ba0d7",
        bullet: "実機 + シミュレータでルーティングを完全マスター",
        sections: [
          {
            heading: "学習領域",
            lines: [
              "ルーティング / スイッチング",
              "OSPF / BGP",
              "VLAN / トランク",
              "セキュリティ ACL",
            ],
          },
          {
            heading: "施設",
            lines: [
              "実機ラック 12台",
              "Packet Tracer 利用可",
              "24時間アクセス可",
              "ペアワーク中心",
            ],
          },
          {
            heading: "サポート",
            lines: [
              "CCNA 取得 → 一時金10万",
              "CCNP 取得 → 一時金30万",
              "受験料 会社負担",
              "失敗しても再挑戦可",
            ],
          },
        ],
      },
      {
        key: "ai-bootcamp",
        title: "AI 実装ブートキャンプ",
        subtitle: "LLM / RAG / Agent 開発",
        tag: "AI",
        accent: "#7a6cff",
        bullet: "8週間でPoCから本番投入レベルへ",
        sections: [
          {
            heading: "カリキュラム",
            lines: [
              "プロンプト設計の基礎",
              "RAG パイプライン構築",
              "エージェント設計パターン",
              "評価とガードレール",
            ],
          },
          {
            heading: "成果物",
            lines: [
              "業務想定アプリを1本",
              "オフライン評価レポート",
              "セキュリティチェック",
              "社内発表会",
            ],
          },
          {
            heading: "前提",
            lines: [
              "Python 中級",
              "クラウド経験あれば加点",
              "週20時間 確保",
              "メンター 1on1 週1回",
            ],
          },
        ],
      },
      {
        key: "security",
        title: "セキュリティ研修",
        subtitle: "防御から検知・対応まで",
        tag: "Security",
        accent: "#d96a3a",
        bullet: "脆弱性診断・SOC運用・インシデント対応の3軸",
        sections: [
          {
            heading: "技術領域",
            lines: [
              "Web脆弱性診断",
              "SIEM ルール設計",
              "EDR / XDR 運用",
              "フォレンジック基礎",
            ],
          },
          {
            heading: "演習",
            lines: [
              "CTF 形式の社内大会",
              "模擬インシデント対応",
              "脅威ハンティング",
              "報告書作成",
            ],
          },
          {
            heading: "資格支援",
            lines: [
              "情報処理安全確保支援士",
              "CompTIA Security+",
              "受験料 全額補助",
              "対策授業 隔週",
            ],
          },
        ],
      },
      {
        key: "soft-skills",
        title: "対人・対顧客スキル",
        subtitle: "コンサル現場で効く",
        tag: "Skills",
        accent: "#5fb87a",
        bullet: "提案・要件定義・プレゼンを実演型で",
        sections: [
          {
            heading: "テーマ",
            lines: [
              "ヒアリング設計",
              "課題の構造化",
              "要件定義の書き方",
              "経営層プレゼン",
            ],
          },
          {
            heading: "進め方",
            lines: [
              "ロールプレイ中心",
              "録画してフィードバック",
              "顧客役は外部講師",
              "ペア学習",
            ],
          },
          {
            heading: "効果",
            lines: [
              "提案採択率の上昇",
              "炎上案件の早期発見",
              "若手の早期戦力化",
              "顧客満足度向上",
            ],
          },
        ],
      },
      {
        key: "mentor",
        title: "メンター制度",
        subtitle: "現場の先輩が伴走",
        tag: "Care",
        accent: "#d4a574",
        bullet: "新人1人にメンター1名・サブメンター1名がつく",
        sections: [
          {
            heading: "仕組み",
            lines: [
              "1on1 週1回 30分",
              "別部署のメンター 月1",
              "目標設定は四半期",
              "心理的安全に配慮",
            ],
          },
          {
            heading: "サポート",
            lines: [
              "技術相談 / キャリア相談",
              "悩み相談も可",
              "メンター研修 必須",
              "守秘義務徹底",
            ],
          },
          {
            heading: "実績",
            lines: [
              "1年定着率 96%",
              "離職時の半数が転職前相談",
              "メンター満足度 4.6/5",
              "他社からも視察あり",
            ],
          },
        ],
      },
    ],
  },

  business: {
    key: "business",
    title: "事業について",
    subtitle: "OUR BUSINESS LINES",
    description:
      "AI事業とセキュリティ事業を二本柱に、設計から運用までを一貫提供。お客様の業務に深く入り込み、本物の成果を出すことを第一にしています。",
    hue: "#9c6868",
    cards: [
      {
        key: "ai-platform",
        title: "AI 業務基盤",
        subtitle: "全社向け生成AI 基盤の構築",
        tag: "AI",
        accent: "#7a6cff",
        bullet: "RAG・権限制御・監査ログを含む 一気通貫の基盤を提供",
        sections: [
          {
            heading: "提供範囲",
            lines: [
              "業務文書の取り込み",
              "権限に応じた検索",
              "監査ログ / 利用統計",
              "業務テンプレート",
            ],
          },
          {
            heading: "技術スタック",
            lines: [
              "GPT-4o / Claude / Gemini",
              "Bedrock / Azure OpenAI",
              "ベクトルDB (Pinecone / pgvector)",
              "認証は Entra ID 連携",
            ],
          },
          {
            heading: "導入実績",
            lines: [
              "金融3社 / 製造2社",
              "公共1団体",
              "立ち上げ最短8週間",
              "PoC 無料相談あり",
            ],
          },
        ],
      },
      {
        key: "ai-agent",
        title: "AI エージェント開発",
        subtitle: "業務を自走するエージェント",
        tag: "AI",
        accent: "#7a6cff",
        bullet: "受発注・問い合わせ対応・レポート生成を自動化",
        sections: [
          {
            heading: "得意領域",
            lines: [
              "受発注処理の自動化",
              "問い合わせの一次回答",
              "経営レポート生成",
              "社内ヘルプデスク",
            ],
          },
          {
            heading: "設計方針",
            lines: [
              "失敗時の人間介入",
              "ガードレール厳格",
              "シナリオごとに評価",
              "段階導入が前提",
            ],
          },
          {
            heading: "効果",
            lines: [
              "工数 平均45%削減",
              "応答時間 1/10",
              "ミス率の低下",
              "夜間休日も稼働",
            ],
          },
        ],
      },
      {
        key: "ai-poc",
        title: "AI PoC 伴走",
        subtitle: "アイデアを動くものに",
        tag: "AI",
        accent: "#7a6cff",
        bullet: "4週間で動くPoCを作り、効果を測定する",
        sections: [
          {
            heading: "進め方",
            lines: [
              "週1回の伴走MTG",
              "2週目で動くPoC",
              "4週目で効果測定",
              "本番化の判断材料を提供",
            ],
          },
          {
            heading: "成果物",
            lines: [
              "PoC アプリ一式",
              "評価レポート",
              "本番設計案",
              "ロードマップ",
            ],
          },
          {
            heading: "条件",
            lines: [
              "固定価格 480万円〜",
              "1チーム 4名体制",
              "業務知識は協力前提",
              "成果物の権利は顧客",
            ],
          },
        ],
      },
      {
        key: "sec-soc",
        title: "SOC 運用",
        subtitle: "24時間365日 監視",
        tag: "Security",
        accent: "#d96a3a",
        bullet: "国内拠点で日本語対応、平均検知時間 3分",
        sections: [
          {
            heading: "監視範囲",
            lines: [
              "EDR / SIEM / メール",
              "クラウド構成監査",
              "Webアプリ攻撃検知",
              "内部不正の兆候",
            ],
          },
          {
            heading: "対応",
            lines: [
              "一次切り分けは自動",
              "重要度に応じてエスカレ",
              "電話 / Teams / メール",
              "週次レポート",
            ],
          },
          {
            heading: "実績",
            lines: [
              "監視対象端末 12万台",
              "重大インシデント0件 (2025)",
              "平均検知 3分",
              "顧客継続率 98%",
            ],
          },
        ],
      },
      {
        key: "sec-pentest",
        title: "脆弱性診断",
        subtitle: "Web / モバイル / IaC",
        tag: "Security",
        accent: "#d96a3a",
        bullet: "OWASP Top10 + 業界特有の検査項目",
        sections: [
          {
            heading: "対象",
            lines: [
              "Webアプリ / API",
              "モバイルアプリ",
              "IaC (Terraform / CFN)",
              "クラウド構成全般",
            ],
          },
          {
            heading: "進め方",
            lines: [
              "事前ヒアリング",
              "診断 (1〜3週間)",
              "報告会",
              "再診断は半額",
            ],
          },
          {
            heading: "成果物",
            lines: [
              "重要度別レポート",
              "再現手順",
              "修正方針案",
              "経営層向けサマリ",
            ],
          },
        ],
      },
      {
        key: "sec-incident",
        title: "インシデント対応",
        subtitle: "侵害された後の最後の砦",
        tag: "Security",
        accent: "#d96a3a",
        bullet: "緊急駆けつけ・被害最小化・復旧支援",
        sections: [
          {
            heading: "対応内容",
            lines: [
              "封じ込め支援",
              "侵害範囲の特定",
              "フォレンジック調査",
              "復旧計画の策定",
            ],
          },
          {
            heading: "体制",
            lines: [
              "受付 24時間",
              "初動2時間以内",
              "弁護士・広報と連携",
              "顧問契約 月額制",
            ],
          },
          {
            heading: "実績",
            lines: [
              "対応案件 年間40件",
              "平均封じ込め 6時間",
              "事業停止 ゼロを継続",
              "再発率 7%",
            ],
          },
        ],
      },
      {
        key: "consulting",
        title: "DX コンサルティング",
        subtitle: "戦略から実装まで一気通貫",
        tag: "Consulting",
        accent: "#5fb87a",
        bullet: "経営課題の翻訳から、システム導入後の定着まで",
        sections: [
          {
            heading: "対応範囲",
            lines: [
              "DX戦略立案",
              "業務プロセス再設計",
              "システム選定",
              "PMO支援",
            ],
          },
          {
            heading: "強み",
            lines: [
              "技術が分かるコンサル",
              "実装チームが社内に",
              "失敗事例も共有",
              "現場主義",
            ],
          },
          {
            heading: "ご支援例",
            lines: [
              "全社AI戦略策定 (大手製造)",
              "営業DX (中堅商社)",
              "保守業務刷新 (公共)",
              "M&A後のIT統合",
            ],
          },
        ],
      },
      {
        key: "managed",
        title: "マネージド運用",
        subtitle: "クラウドの面倒を全部見る",
        tag: "Operations",
        accent: "#0078d4",
        bullet: "監視・パッチ・コスト最適化を月額で",
        sections: [
          {
            heading: "提供内容",
            lines: [
              "24/7 監視",
              "パッチ適用",
              "コスト最適化",
              "障害対応",
            ],
          },
          {
            heading: "対象",
            lines: [
              "AWS / Azure / GCP",
              "Kubernetes",
              "オンプレ仮想化",
              "ハイブリッド構成",
            ],
          },
          {
            heading: "成果",
            lines: [
              "コスト削減 平均22%",
              "障害ダウンタイム 1/3",
              "運用人員 1/2",
              "セキュリティ事故 ゼロ継続",
            ],
          },
        ],
      },
    ],
  },

  welfare: {
    key: "welfare",
    title: "福利厚生について",
    subtitle: "BENEFITS & WELL-BEING",
    description:
      "「学び続けられる人」を支えるための28種類の制度。家族のイベントも、健康も、キャリアの不安も、会社が一緒に背負います。",
    hue: "#7ca088",
    cards: [
      {
        key: "holidays",
        title: "年間休日125日",
        subtitle: "完全週休2日 + 夏季 / 年末年始",
        tag: "休日",
        accent: "#5fb87a",
        bullet: "祝日はカレンダー通り、夏季5日・年末年始6日",
        sections: [
          {
            heading: "内訳",
            lines: [
              "土日 104日",
              "祝日 16日",
              "夏季休暇 5日",
              "年末年始 6日 (12/29-1/4)",
            ],
          },
          {
            heading: "有休",
            lines: [
              "初年度から20日付与",
              "時間単位取得可",
              "取得率 平均 86%",
              "理由問わず取得可",
            ],
          },
          {
            heading: "特別休暇",
            lines: [
              "結婚 5日",
              "出産 (配偶者) 5日",
              "忌引 1〜10日",
              "リフレッシュ 入社5年で5日",
            ],
          },
        ],
      },
      {
        key: "remote",
        title: "完全リモート可",
        subtitle: "出社は任意",
        tag: "働き方",
        accent: "#0078d4",
        bullet: "全国どこからでも勤務可。地方手当あり",
        sections: [
          {
            heading: "制度内容",
            lines: [
              "出社頻度 自由",
              "コアタイムなし",
              "海外短期勤務 OK",
              "家具補助 上限10万",
            ],
          },
          {
            heading: "コミュニケーション",
            lines: [
              "週1チームMTG",
              "雑談チャンネル活発",
              "オフサイト 年2回",
              "1on1 月2回",
            ],
          },
          {
            heading: "実績",
            lines: [
              "リモート率 78%",
              "地方在住 32%",
              "海外勤務 18名",
              "通勤ストレス 大幅減",
            ],
          },
        ],
      },
      {
        key: "education",
        title: "学習支援 月3万円",
        subtitle: "書籍・受験料・講座 すべて対応",
        tag: "学び",
        accent: "#7a6cff",
        bullet: "業務関連なら何にでも使える年間36万円の枠",
        sections: [
          {
            heading: "対象",
            lines: [
              "書籍 / 雑誌",
              "オンライン講座",
              "資格試験",
              "カンファレンス参加",
            ],
          },
          {
            heading: "申請",
            lines: [
              "上長承認のみ",
              "事後精算 OK",
              "領収書アップロード",
              "却下率 ほぼゼロ",
            ],
          },
          {
            heading: "実績",
            lines: [
              "利用率 92%",
              "資格合格 年300件",
              "書籍棚 社内に常備",
              "勉強会 週3回",
            ],
          },
        ],
      },
      {
        key: "health",
        title: "健康サポート",
        subtitle: "人間ドック + 産業医 + メンタル相談",
        tag: "健康",
        accent: "#d96a3a",
        bullet: "30歳以上は人間ドック全額補助、メンタル相談は匿名で",
        sections: [
          {
            heading: "健診",
            lines: [
              "定期健診 年1回",
              "人間ドック 30歳〜",
              "脳ドック 40歳〜",
              "婦人科健診 全額",
            ],
          },
          {
            heading: "メンタル",
            lines: [
              "産業医 月1回",
              "外部カウンセラー 24時間",
              "匿名チャット相談",
              "復職支援プログラム",
            ],
          },
          {
            heading: "ジム",
            lines: [
              "提携ジム 全国2400店",
              "月会費 全額補助",
              "オンラインヨガ無料",
              "歩数イベント 月1",
            ],
          },
        ],
      },
      {
        key: "family",
        title: "家族支援",
        subtitle: "出産・育児・介護を全力サポート",
        tag: "家族",
        accent: "#d4a574",
        bullet: "育休復帰率 98%、男性育休取得率 81%",
        sections: [
          {
            heading: "出産・育児",
            lines: [
              "産休 法定+α",
              "育休 男女とも 最長3年",
              "育児短時間勤務 小学校卒業まで",
              "ベビーシッター補助",
            ],
          },
          {
            heading: "介護",
            lines: [
              "介護休業 通算1年",
              "介護休暇 年10日",
              "短時間勤務 利用可",
              "外部相談窓口 無料",
            ],
          },
          {
            heading: "イベント",
            lines: [
              "結婚祝金 10万円",
              "出産祝金 子1人20万",
              "入学祝金 5万",
              "誕生月にプレゼント",
            ],
          },
        ],
      },
      {
        key: "money",
        title: "金銭サポート",
        subtitle: "退職金・財形・持株会",
        tag: "お金",
        accent: "#5fb87a",
        bullet: "確定拠出年金 + 持株会 + 住宅手当",
        sections: [
          {
            heading: "退職・年金",
            lines: [
              "確定拠出年金 月最大5.5万",
              "退職金制度 あり",
              "勤続5年で 退職金確定",
              "iDeCo 併用可",
            ],
          },
          {
            heading: "住宅",
            lines: [
              "住宅手当 上限月3万",
              "引越補助 上限15万",
              "社宅 主要都市に",
              "リモート手当 月1万",
            ],
          },
          {
            heading: "資産形成",
            lines: [
              "財形貯蓄 / 持株会",
              "持株 奨励金10%",
              "ストックオプション 全社員対象",
              "金融研修 年2回",
            ],
          },
        ],
      },
    ],
  },

  company: {
    key: "company",
    title: "会社概要",
    subtitle: "ABOUT TECH PARTNERS",
    description:
      "2005年創業、社員1820名のITサービス企業。お客様の本当の課題を解決するため、技術と人の力を磨き続けています。",
    hue: "#8c7a9c",
    cards: [
      {
        key: "overview",
        title: "会社情報",
        subtitle: "基本データ",
        tag: "Profile",
        accent: "#8c7a9c",
        bullet: "創業2005年、社員1820名、東京・大阪・福岡・札幌に拠点",
        sections: [
          {
            heading: "基本情報",
            lines: [
              "社名 株式会社テックパートナーズ",
              "創業 2005年4月",
              "代表 田中 健司",
              "資本金 4億2000万円",
            ],
          },
          {
            heading: "拠点",
            lines: [
              "東京本社 (港区)",
              "大阪支社",
              "福岡支社",
              "札幌支社 / 仙台拠点",
            ],
          },
          {
            heading: "認証",
            lines: [
              "ISMS / Pマーク",
              "ISO 9001",
              "AWS / Azure / Cisco パートナー",
              "健康経営優良法人",
            ],
          },
        ],
      },
      {
        key: "numbers",
        title: "数字で見る",
        subtitle: "重要KPI",
        tag: "Numbers",
        accent: "#7a6cff",
        bullet: "売上184億・社員1820名・離職率4%",
        sections: [
          {
            heading: "売上",
            lines: [
              "2025年度 184億円",
              "前年比 +12%",
              "AI事業 +38%",
              "セキュリティ +24%",
            ],
          },
          {
            heading: "社員",
            lines: [
              "社員数 1820名",
              "女性比率 41%",
              "平均年齢 33.8歳",
              "技術職 比率 78%",
            ],
          },
          {
            heading: "定着",
            lines: [
              "離職率 4.1%",
              "1年定着率 96%",
              "新卒離職率 2.5%",
              "社員満足度 4.4/5",
            ],
          },
        ],
      },
      {
        key: "history",
        title: "沿革",
        subtitle: "20年の歩み",
        tag: "History",
        accent: "#d4a574",
        bullet: "5名のスタートアップから始まった、20年の事業成長",
        sections: [
          {
            heading: "創業期",
            lines: [
              "2005 創業 (5名)",
              "2008 中小企業向けIT保守 拡大",
              "2010 大阪支社設立",
              "2012 50名突破",
            ],
          },
          {
            heading: "拡大期",
            lines: [
              "2015 セキュリティ事業 開始",
              "2018 AWS Premier Partner",
              "2020 福岡 / 札幌 同時開設",
              "2022 1000名突破",
            ],
          },
          {
            heading: "現在",
            lines: [
              "2024 AI事業 本格展開",
              "2025 公共案件 受注拡大",
              "2026 海外拠点 シンガポール",
              "次のステージへ",
            ],
          },
        ],
      },
      {
        key: "values",
        title: "私たちの大切にしていること",
        subtitle: "VALUES",
        tag: "Values",
        accent: "#5fb87a",
        bullet: "正直に、誠実に、最後まで",
        sections: [
          {
            heading: "顧客に対して",
            lines: [
              "本当の課題を見つける",
              "できないことは できないと伝える",
              "短期の売上より 長期の信頼",
              "成功の定義を一緒に作る",
            ],
          },
          {
            heading: "仲間に対して",
            lines: [
              "心理的安全 第一",
              "失敗から学ぶ",
              "成果はチームで分かち合う",
              "嫉妬より応援",
            ],
          },
          {
            heading: "技術に対して",
            lines: [
              "流行より基礎",
              "派手さより堅さ",
              "好奇心は止めない",
              "学びは仕事の一部",
            ],
          },
        ],
      },
      {
        key: "csr",
        title: "社会との関わり",
        subtitle: "CSR & Community",
        tag: "CSR",
        accent: "#0078d4",
        bullet: "教育・地域・環境の3軸で取り組み",
        sections: [
          {
            heading: "教育",
            lines: [
              "高校への出張授業",
              "学生向けインターン",
              "OSS への寄付・コミット",
              "技術書 寄贈活動",
            ],
          },
          {
            heading: "地域",
            lines: [
              "地方拠点での雇用創出",
              "災害時のIT支援",
              "シニア向けITサポート",
              "子ども食堂 協賛",
            ],
          },
          {
            heading: "環境",
            lines: [
              "クラウド最適化で電力削減",
              "オフィス再エネ化",
              "ペーパーレス徹底",
              "再生材オフィス家具",
            ],
          },
        ],
      },
      {
        key: "leadership",
        title: "経営陣",
        subtitle: "Leadership",
        tag: "People",
        accent: "#9c6868",
        bullet: "現場叩き上げ + 多様なバックグラウンド",
        sections: [
          {
            heading: "代表取締役",
            lines: [
              "田中 健司 (CEO)",
              "創業者・元エンジニア",
              "AWS Hero",
              "技術書3冊 著者",
            ],
          },
          {
            heading: "役員",
            lines: [
              "森本 真理 (COO)",
              "佐藤 拓海 (CFO)",
              "Lin Hua (CTO)",
              "社外取締役 3名",
            ],
          },
          {
            heading: "顧問",
            lines: [
              "セキュリティ顧問 1名",
              "AI顧問 2名",
              "法務顧問 1名",
              "業界別アドバイザリー",
            ],
          },
        ],
      },
    ],
  },
};
