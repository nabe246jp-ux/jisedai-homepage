/**
 * 月ごとの季節演出の定義。
 * 背景色・装飾・粒子（葉・花弁・雪など）・名称をまとめる。
 *
 * すべて HSL 表現に近い RGB を返すことで、Three.js 側の Color オブジェクトに
 * そのまま渡せるようにしている。
 */

export type ParticleKind = "sakura" | "leaves" | "snow" | "fireflies" | "rain" | "none";

export type SeasonProfile = {
  monthIndex: number; // 0-11
  label: string;      // 表示用（例: 春の訪れ）
  /** 空の上方の色 */
  skyTop: string;
  /** 空の地平線の色 */
  skyBottom: string;
  /** 環境光の色 */
  ambient: string;
  /** 太陽光（指向性ライト）の色 */
  sun: string;
  /** 地面のベース色 */
  ground: string;
  /** 季節を象徴する粒子 */
  particle: ParticleKind;
  /** 装飾として木々に追加する色（花・葉・実など） */
  treeAccent: string;
  /** 霧の濃さ 0..1 */
  fog: number;
};

export const SEASON_PROFILES: SeasonProfile[] = [
  // 1月
  {
    monthIndex: 0,
    label: "新年の朝靄",
    skyTop: "#0e1a3a",
    skyBottom: "#dbe8f4",
    ambient: "#b8c8db",
    sun: "#fef3df",
    ground: "#e8edf2",
    particle: "snow",
    treeAccent: "#ffffff",
    fog: 0.45,
  },
  // 2月
  {
    monthIndex: 1,
    label: "晩冬の青",
    skyTop: "#13234a",
    skyBottom: "#c9d6e8",
    ambient: "#a8b8cf",
    sun: "#fef0d4",
    ground: "#dfe4ea",
    particle: "snow",
    treeAccent: "#e8eef5",
    fog: 0.40,
  },
  // 3月
  {
    monthIndex: 2,
    label: "桜のはじまり",
    skyTop: "#3b2a4a",
    skyBottom: "#f5d6e0",
    ambient: "#e8c9d4",
    sun: "#fde2c8",
    ground: "#eaddd8",
    particle: "sakura",
    treeAccent: "#f5c6d6",
    fog: 0.30,
  },
  // 4月
  {
    monthIndex: 3,
    label: "桜満開",
    skyTop: "#2c2545",
    skyBottom: "#fbe1ea",
    ambient: "#f4d5dc",
    sun: "#ffe6c0",
    ground: "#f0e6e2",
    particle: "sakura",
    treeAccent: "#f8b5cc",
    fog: 0.20,
  },
  // 5月
  {
    monthIndex: 4,
    label: "新緑の風",
    skyTop: "#1f3a5a",
    skyBottom: "#cfe7d8",
    ambient: "#bcd6c5",
    sun: "#fdf0c8",
    ground: "#cfd9c8",
    particle: "fireflies",
    treeAccent: "#7fb284",
    fog: 0.18,
  },
  // 6月
  {
    monthIndex: 5,
    label: "梅雨の銀",
    skyTop: "#28384e",
    skyBottom: "#b6c4ce",
    ambient: "#9aa9b3",
    sun: "#e0e6ec",
    ground: "#aab5b8",
    particle: "rain",
    treeAccent: "#5a8a6b",
    fog: 0.55,
  },
  // 7月
  {
    monthIndex: 6,
    label: "盛夏の青",
    skyTop: "#0e3a6e",
    skyBottom: "#bce0ff",
    ambient: "#9dc3e8",
    sun: "#fff5d8",
    ground: "#bdc8b0",
    particle: "fireflies",
    treeAccent: "#3e8050",
    fog: 0.10,
  },
  // 8月
  {
    monthIndex: 7,
    label: "夏の終わり",
    skyTop: "#1a2855",
    skyBottom: "#f0c898",
    ambient: "#dab392",
    sun: "#ffd29a",
    ground: "#c4b294",
    particle: "fireflies",
    treeAccent: "#356f4a",
    fog: 0.20,
  },
  // 9月
  {
    monthIndex: 8,
    label: "秋風はじめ",
    skyTop: "#2a1f3f",
    skyBottom: "#f3b888",
    ambient: "#dca48a",
    sun: "#ffc480",
    ground: "#bea478",
    particle: "leaves",
    treeAccent: "#c8804a",
    fog: 0.25,
  },
  // 10月
  {
    monthIndex: 9,
    label: "紅葉の盛り",
    skyTop: "#3a1f2f",
    skyBottom: "#f5a06a",
    ambient: "#e0905f",
    sun: "#ffb070",
    ground: "#a88858",
    particle: "leaves",
    treeAccent: "#d96a3a",
    fog: 0.30,
  },
  // 11月
  {
    monthIndex: 10,
    label: "晩秋の黄昏",
    skyTop: "#2a1828",
    skyBottom: "#cf8870",
    ambient: "#b8775a",
    sun: "#ff9a60",
    ground: "#8c7050",
    particle: "leaves",
    treeAccent: "#a85838",
    fog: 0.40,
  },
  // 12月
  {
    monthIndex: 11,
    label: "聖夜の灯り",
    skyTop: "#0a0f24",
    skyBottom: "#3a4258",
    ambient: "#5a6478",
    sun: "#ffe0b8",
    ground: "#aab0b8",
    particle: "snow",
    treeAccent: "#e8e2d4",
    fog: 0.50,
  },
];

export function getSeason(date: Date): SeasonProfile {
  return SEASON_PROFILES[date.getMonth()];
}

/**
 * 月の境目で滑らかに色を補間したい場合に使う。
 * 月の前半は前月との混ぜ、後半は次月との混ぜ。
 */
export function getInterpolatedSeason(date: Date): SeasonProfile {
  const m = date.getMonth();
  const day = date.getDate();
  const daysInMonth = new Date(date.getFullYear(), m + 1, 0).getDate();
  // 0 = 月初, 1 = 月末
  const t = (day - 1) / Math.max(1, daysInMonth - 1);
  const current = SEASON_PROFILES[m];
  // 月末に近づくと次月へブレンド (最後の20%だけ)
  if (t > 0.8) {
    const next = SEASON_PROFILES[(m + 1) % 12];
    const k = (t - 0.8) / 0.2;
    return blendSeasons(current, next, k);
  }
  return current;
}

function blendSeasons(a: SeasonProfile, b: SeasonProfile, k: number): SeasonProfile {
  return {
    monthIndex: a.monthIndex,
    label: k > 0.5 ? b.label : a.label,
    skyTop: mixColor(a.skyTop, b.skyTop, k),
    skyBottom: mixColor(a.skyBottom, b.skyBottom, k),
    ambient: mixColor(a.ambient, b.ambient, k),
    sun: mixColor(a.sun, b.sun, k),
    ground: mixColor(a.ground, b.ground, k),
    particle: k > 0.5 ? b.particle : a.particle,
    treeAccent: mixColor(a.treeAccent, b.treeAccent, k),
    fog: a.fog + (b.fog - a.fog) * k,
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColor(a: string, b: string, k: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * k, ag + (bg - ag) * k, ab + (bb - ab) * k);
}
