"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore, type Kpis } from "@/lib/store";

type Item = {
  key: keyof Kpis;
  label: string;
  unit: string;
  format: (n: number) => string;
};

const ITEMS: Item[] = [
  { key: "revenue", label: "売上", unit: "万円", format: (n) => n.toLocaleString() },
  { key: "profit", label: "利益", unit: "万円", format: (n) => n.toLocaleString() },
  { key: "employees", label: "社員数", unit: "名", format: (n) => n.toLocaleString() },
  { key: "visitorsToday", label: "今日の訪問者", unit: "人", format: (n) => n.toLocaleString() },
  { key: "activeAis", label: "稼働中AI", unit: "体", format: (n) => n.toLocaleString() },
];

export default function KPIBoard() {
  const kpis = useStore((s) => s.kpis);
  const lastKpiUpdate = useStore((s) => s.lastKpiUpdate);
  const randomize = useStore((s) => s.randomizeKpis);

  // 自動更新（25秒ごと）
  useEffect(() => {
    const id = setInterval(() => randomize(), 25_000);
    return () => clearInterval(id);
  }, [randomize]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="fixed top-20 right-6 z-30"
    >
      <div className="glass-panel rounded-2xl p-5 w-[260px]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] tracking-[0.3em] gold-text font-semibold">LIVE METRICS</div>
          <button
            onClick={() => randomize()}
            className="text-[10px] tracking-widest text-amber-200/80 hover:text-amber-100 px-2 py-1 rounded border border-amber-200/20 hover:border-amber-200/40 transition"
          >
            UPDATE
          </button>
        </div>

        <div className="space-y-3">
          {ITEMS.map((it) => (
            <Row key={it.key} item={it} value={kpis[it.key]} stamp={lastKpiUpdate} />
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-amber-200/10 text-[10px] text-amber-100/40 tracking-wider">
          25秒ごとに自動更新 / 押すと即更新
        </div>
      </div>
    </motion.div>
  );
}

function Row({ item, value, stamp }: { item: Item; value: number; stamp: number }) {
  const prev = useRef(value);
  const [animKey, setAnimKey] = useState(0);
  const [delta, setDelta] = useState<"up" | "down" | "same">("same");
  const [display, setDisplay] = useState(value);

  // 値変化時にカウントアップアニメ
  useEffect(() => {
    if (prev.current === value) return;
    const start = prev.current;
    const end = value;
    const dur = 800;
    const t0 = performance.now();
    setDelta(end > start ? "up" : end < start ? "down" : "same");
    setAnimKey((k) => k + 1);
    let raf = 0;
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else prev.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="flex items-baseline justify-between">
      <div className="text-[11px] text-amber-100/55 tracking-wider">{item.label}</div>
      <div className="flex items-baseline gap-1">
        <span
          key={animKey}
          className="font-display text-[22px] gold-text font-semibold num-flash tabular-nums"
        >
          {item.format(display)}
        </span>
        <span className="text-[10px] text-amber-100/45">{item.unit}</span>
        <span
          className={`ml-1 text-[10px] ${
            delta === "up" ? "text-emerald-300" : delta === "down" ? "text-rose-300" : "text-amber-100/30"
          }`}
        >
          {delta === "up" ? "▲" : delta === "down" ? "▼" : "—"}
        </span>
      </div>
    </div>
  );
}
