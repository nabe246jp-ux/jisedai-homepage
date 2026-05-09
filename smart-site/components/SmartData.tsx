"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { metrics, type Metric } from "@/lib/mockData";

function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("ja-JP")
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, value, { duration: 1.6, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, value, mv]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

function trendIcon(t: Metric["trend"]) {
  if (t === "up") return <TrendingUp size={14} className="text-emerald-500" />;
  if (t === "down") return <TrendingDown size={14} className="text-rose-500" />;
  return <Minus size={14} className="text-ink-300" />;
}

export default function SmartData() {
  return (
    <section id="smart-data" className="relative bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <div className="text-xs font-semibold tracking-widest text-brand-600">
            SMART DATA
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
            会社の“今”を、数字で語る。
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500">
            社内データやSaaSと連携し、サイト訪問者にリアルな数字を自動で伝えます。
            （本デモは仮の値です）
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((m, i) => {
            const decimals = String(m.value).includes(".")
              ? String(m.value).split(".")[1].length
              : 0;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-surface-100 bg-white p-6 shadow-soft transition hover:shadow-glow"
              >
                <div className="text-xs text-ink-300">{m.label}</div>
                <div className="mt-2 flex items-baseline gap-1 text-4xl font-bold text-ink-900">
                  <CountUp value={m.value} decimals={decimals} />
                  <span className="text-base font-medium text-ink-500">
                    {m.suffix}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs">
                  {trendIcon(m.trend)}
                  <span
                    className={
                      m.trend === "up"
                        ? "text-emerald-600"
                        : m.trend === "down"
                          ? "text-rose-600"
                          : "text-ink-500"
                    }
                  >
                    {m.delta}
                  </span>
                  <span className="text-ink-300">{m.description}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
