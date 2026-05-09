"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

/**
 * デモ用の操作パネル。
 * - 日付を1日進める / 30日進める / 今日に戻す
 * - 時刻を3時間進める
 * - これで「月が変わると季節が変わる」「時間帯で空が変わる」を即確認できる
 */
export default function DemoControls() {
  const virtualDate = useStore((s) => s.virtualDate);
  const setVirtualDate = useStore((s) => s.setVirtualDate);
  const advanceDays = useStore((s) => s.advanceDays);
  const randomize = useStore((s) => s.randomizeKpis);

  const advanceHours = (h: number) => {
    const base = virtualDate ?? new Date();
    const next = new Date(base);
    next.setHours(next.getHours() + h);
    setVirtualDate(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 }}
      className="fixed bottom-6 left-6 z-30"
    >
      <div className="glass-panel rounded-2xl p-4 w-[280px]">
        <div className="text-[10px] tracking-[0.3em] gold-text font-semibold mb-3">
          DEMO CONTROLS
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Btn onClick={() => advanceHours(3)}>＋3時間</Btn>
          <Btn onClick={() => advanceHours(-3)}>−3時間</Btn>
          <Btn onClick={() => advanceDays(1)}>＋1日</Btn>
          <Btn onClick={() => advanceDays(30)}>＋1ヶ月</Btn>
          <Btn onClick={() => randomize()}>数字を更新</Btn>
          <Btn onClick={() => setVirtualDate(null)}>今に戻す</Btn>
        </div>

        <div className="mt-3 pt-3 border-t border-amber-200/10 text-[10px] text-amber-100/40 tracking-wider leading-relaxed">
          時間と日付を操作して、季節装飾と空の変化を確認できます
        </div>
      </div>
    </motion.div>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] py-2 rounded-md bg-amber-200/5 text-amber-100/85 tracking-wider hover:bg-amber-200/10 hover:text-amber-100 border border-amber-200/15 hover:border-amber-200/30 transition"
    >
      {children}
    </button>
  );
}
