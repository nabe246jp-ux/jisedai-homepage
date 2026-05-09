export type TimeOfDay = "dawn" | "morning" | "noon" | "evening" | "dusk" | "night";

export type TimePalette = {
  skyOverlay: string;
  horizonOverlay: string;
  overlayStrength: number;
  sunIntensity: number;
  ambientIntensity: number;
  lampIntensity: number;
  clockFaceEmissive: number;
  label: string;
};

export function getTimeOfDay(date: Date): TimeOfDay {
  const h = date.getHours();
  if (h >= 4 && h < 6) return "dawn";
  if (h >= 6 && h < 11) return "morning";
  if (h >= 11 && h < 16) return "noon";
  if (h >= 16 && h < 18) return "evening";
  if (h >= 18 && h < 20) return "dusk";
  return "night";
}

export function getTimePalette(date: Date): TimePalette {
  const h = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  const keys: { t: number; p: TimePalette }[] = [
    {
      t: 0,
      p: {
        skyOverlay: "#1a1a2e", horizonOverlay: "#2a2050",
        overlayStrength: 0.65, sunIntensity: 0.25,
        ambientIntensity: 0.7, lampIntensity: 1.0,
        clockFaceEmissive: 2.4, label: "深夜",
      },
    },
    {
      t: 5,
      p: {
        skyOverlay: "#5a4a8a", horizonOverlay: "#ffc89a",
        overlayStrength: 0.40, sunIntensity: 0.9,
        ambientIntensity: 0.95, lampIntensity: 0.6,
        clockFaceEmissive: 1.5, label: "夜明け",
      },
    },
    {
      t: 8,
      p: {
        skyOverlay: "#cfe6ff", horizonOverlay: "#fff4d8",
        overlayStrength: 0.10, sunIntensity: 2.0,
        ambientIntensity: 1.2, lampIntensity: 0.0,
        clockFaceEmissive: 0.4, label: "朝",
      },
    },
    {
      t: 12,
      p: {
        skyOverlay: "#a4d4f5", horizonOverlay: "#eef4f8",
        overlayStrength: 0.05, sunIntensity: 2.4,
        ambientIntensity: 1.4, lampIntensity: 0.0,
        clockFaceEmissive: 0.2, label: "昼",
      },
    },
    {
      t: 17,
      p: {
        skyOverlay: "#ffc090", horizonOverlay: "#ffd8a4",
        overlayStrength: 0.30, sunIntensity: 1.5,
        ambientIntensity: 1.0, lampIntensity: 0.3,
        clockFaceEmissive: 0.8, label: "夕方",
      },
    },
    {
      t: 19,
      p: {
        skyOverlay: "#7858a4", horizonOverlay: "#ff9078",
        overlayStrength: 0.55, sunIntensity: 0.85,
        ambientIntensity: 0.85, lampIntensity: 0.85,
        clockFaceEmissive: 1.6, label: "黄昏",
      },
    },
    {
      t: 21,
      p: {
        skyOverlay: "#2a2858", horizonOverlay: "#5a3a78",
        overlayStrength: 0.65, sunIntensity: 0.4,
        ambientIntensity: 0.75, lampIntensity: 1.0,
        clockFaceEmissive: 2.2, label: "夜",
      },
    },
    {
      t: 24,
      p: {
        skyOverlay: "#1a1a2e", horizonOverlay: "#2a2050",
        overlayStrength: 0.65, sunIntensity: 0.25,
        ambientIntensity: 0.7, lampIntensity: 1.0,
        clockFaceEmissive: 2.4, label: "深夜",
      },
    },
  ];

  let a = keys[0], b = keys[1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (h >= keys[i].t && h <= keys[i + 1].t) {
      a = keys[i]; b = keys[i + 1]; break;
    }
  }
  const k = (h - a.t) / Math.max(0.0001, b.t - a.t);
  return {
    skyOverlay: mixHex(a.p.skyOverlay, b.p.skyOverlay, k),
    horizonOverlay: mixHex(a.p.horizonOverlay, b.p.horizonOverlay, k),
    overlayStrength: a.p.overlayStrength + (b.p.overlayStrength - a.p.overlayStrength) * k,
    sunIntensity: a.p.sunIntensity + (b.p.sunIntensity - a.p.sunIntensity) * k,
    ambientIntensity: a.p.ambientIntensity + (b.p.ambientIntensity - a.p.ambientIntensity) * k,
    lampIntensity: a.p.lampIntensity + (b.p.lampIntensity - a.p.lampIntensity) * k,
    clockFaceEmissive: a.p.clockFaceEmissive + (b.p.clockFaceEmissive - a.p.clockFaceEmissive) * k,
    label: k < 0.5 ? a.p.label : b.p.label,
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

function mixHex(a: string, b: string, k: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * k, ag + (bg - ag) * k, ab + (bb - ab) * k);
}
