"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { topics, type Topic } from "@/lib/mockData";

const categories: ("すべて" | Topic["category"])[] = [
  "すべて",
  "プレス",
  "事例",
  "お知らせ",
  "ブログ"
];

export default function SmartTopics() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("すべて");
  const filtered = filter === "すべて" ? topics : topics.filter((t) => t.category === filter);

  // 流れるカードは2回繰り返してループ感を出す
  const looped = [...filtered, ...filtered];

  return (
    <section id="smart-topics" className="bg-surface-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-semibold tracking-widest text-brand-600">
              SMART TOPICS
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
              最新の動きが、勝手に集まる。
            </h2>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              プレス、事例、お知らせ、ブログ。社内のチャネルから自動で集約します。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c === filter;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    active
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-surface-100 bg-white text-ink-500 hover:border-brand-300 hover:text-brand-600"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fade-mask-x relative overflow-hidden">
        <motion.div
          key={filter}
          className="flex gap-4 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {looped.map((t, i) => (
            <a
              key={`${t.id}-${i}`}
              href="#"
              className="group flex w-80 flex-shrink-0 flex-col rounded-2xl border border-surface-100 bg-white p-5 shadow-soft transition hover:border-brand-300 hover:shadow-glow"
            >
              <div className="flex items-center gap-2 text-[10px]">
                <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
                  {t.category}
                </span>
                <span className="text-ink-300">{t.date}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-snug text-ink-900 group-hover:text-brand-600">
                {t.title}
              </h3>
              <div className="mt-auto pt-4 text-[10px] text-ink-300">
                #{t.tag}
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
