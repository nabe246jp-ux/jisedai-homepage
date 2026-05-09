"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

const W_DAY = ["日", "月", "火", "水", "木", "金", "土"];

/**
 * 画面上部中央に浮かべる デジタル時計の HUD。
 * 仮想時刻（virtualDate）を表示。100ms 単位で更新される。
 */
export default function DigitalClock() {
  const virtualDate = useStore((s) => s.virtualDate);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 200);
    return () => clearInterval(id);
  }, []);

  const now = virtualDate ?? new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className="fixed top-20 right-6 z-30 pointer-events-none"
      data-tick={tick}
    >
      <div className="dc-frame">
        <div className="dc-inner">
          <div className="dc-eyebrow">TOWN TIME</div>
          <div className="dc-time">
            <span className="dc-digit">{pad(now.getHours())}</span>
            <span className="dc-colon">:</span>
            <span className="dc-digit">{pad(now.getMinutes())}</span>
            <span className="dc-colon dc-colon-sm">:</span>
            <span className="dc-digit dc-digit-sm">{pad(now.getSeconds())}</span>
          </div>
          <div className="dc-date">
            {now.getFullYear()}年 {now.getMonth() + 1}月 {now.getDate()}日 ({W_DAY[now.getDay()]})
          </div>
        </div>
      </div>
    </motion.div>
  );
}
