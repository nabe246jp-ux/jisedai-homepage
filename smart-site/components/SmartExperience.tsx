"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, Store, Headphones, FlaskConical } from "lucide-react";
import { experiencePoints, type ExperiencePoint } from "@/lib/mockData";

const iconMap = {
  office: Building2,
  showroom: Store,
  support: Headphones,
  lab: FlaskConical
} as const;

const colorMap = {
  office: "from-brand-500 to-brand-700",
  showroom: "from-emerald-400 to-emerald-600",
  support: "from-amber-400 to-amber-600",
  lab: "from-violet-400 to-violet-600"
} as const;

export default function SmartExperience() {
  const [selected, setSelected] = useState<ExperiencePoint>(experiencePoints[0]);

  return (
    <section id="smart-experience" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold tracking-widest text-brand-600">
            SMART EXPERIENCE
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
            会社のすべてを、地図のように歩く。
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500">
            拠点・部署・サービスをマップ上で可視化。アイコンを選ぶと詳細が表示されます。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* マップ */}
          <div className="relative overflow-hidden rounded-3xl border border-surface-100 bg-gradient-to-br from-surface-50 to-white p-4 shadow-soft md:col-span-2">
            <div className="bg-dot relative h-80 w-full rounded-2xl border border-surface-100 bg-white md:h-[420px]">
              {/* 補助線 */}
              <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-70" />

              {/* 接続線 */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full">
                {experiencePoints
                  .filter((p) => p.id !== selected.id)
                  .map((p) => (
                    <line
                      key={`line-${p.id}`}
                      x1={`${selected.x}%`}
                      y1={`${selected.y}%`}
                      x2={`${p.x}%`}
                      y2={`${p.y}%`}
                      stroke="rgba(61,110,255,0.15)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  ))}
              </svg>

              {experiencePoints.map((p) => {
                const Icon = iconMap[p.category];
                const active = p.id === selected.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    {active && (
                      <motion.span
                        layoutId="exp-ring"
                        className="absolute -inset-3 rounded-full border border-brand-500"
                      />
                    )}
                    <span
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-glow transition ${
                        colorMap[p.category]
                      } ${active ? "scale-110" : "opacity-90 hover:scale-105"}`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="absolute left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] text-ink-500">
                      {p.label}
                    </span>
                  </button>
                );
              })}

              {/* 浮遊する装飾 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute right-4 top-4 rounded-full border border-surface-100 bg-white px-2 py-1 text-[10px] text-ink-300 shadow-soft"
              >
                Map View · Live
              </motion.div>
            </div>
          </div>

          {/* 詳細パネル */}
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-surface-100 bg-white p-6 shadow-soft"
          >
            <div className="text-xs text-ink-300">SELECTED</div>
            <h3 className="mt-2 text-2xl font-bold text-ink-900">
              {selected.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {selected.description}
            </p>

            <div className="mt-6 space-y-2 text-xs">
              {experiencePoints.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 transition ${
                    p.id === selected.id
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-surface-100 bg-white text-ink-500 hover:border-brand-300"
                  }`}
                >
                  <span>{p.label}</span>
                  <span className="text-[10px] opacity-70">{p.category}</span>
                </button>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-xs font-medium text-white shadow-soft transition hover:bg-brand-700"
            >
              この拠点について相談する
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
