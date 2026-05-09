"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getInterpolatedSeason } from "@/lib/seasons";
import { getTimePalette } from "@/lib/timeOfDay";

const W_DAY = ["日", "月", "火", "水", "木", "金", "土"];

export default function LiveTime() {
  const virtualDate = useStore((s) => s.virtualDate);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, []);

  const display = virtualDate ?? now;
  const season = getInterpolatedSeason(display);
  const tp = getTimePalette(display);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      className="fixed top-20 left-6 z-30"
    >
      <div className="glass-panel rounded-2xl p-5 w-[280px]">
        <div className="text-[10px] tracking-[0.3em] gold-text font-semibold mb-2">
          TOWN TIME
        </div>

        <div className="flex items-baseline gap-2">
          <div className="font-display text-[44px] gold-text font-semibold leading-none tabular-nums">
            {pad(display.getHours())}:{pad(display.getMinutes())}
          </div>
          <div className="font-display text-[20px] text-amber-100/55 tabular-nums">
            :{pad(display.getSeconds())}
          </div>
        </div>

        <div className="mt-2 text-[12px] text-amber-100/70 tracking-wider">
          {display.getFullYear()}年 {display.getMonth() + 1}月 {display.getDate()}日
          （{W_DAY[display.getDay()]}）
        </div>

        <div className="mt-3 pt-3 border-t border-amber-200/10 flex items-center justify-between">
          <div className="text-[11px] text-amber-100/55 tracking-wider">
            {season.label}
          </div>
          <div className="text-[10px] text-amber-100/40 tracking-wider uppercase">
            {tp.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
