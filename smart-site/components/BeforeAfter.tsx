"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { beforeAfterItems } from "@/lib/mockData";

export default function BeforeAfter() {
  const [view, setView] = useState<"before" | "after">("after");

  return (
    <section className="bg-surface-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold tracking-widest text-brand-600">
            BEFORE / AFTER
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
            “普通のHP”から、“動くサイト”へ。
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500">
            ボタンを切り替えて違いをご覧ください。
          </p>
        </div>

        {/* トグル */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-surface-100 bg-white p-1 shadow-soft">
            {(["before", "after"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-5 py-2 text-xs font-medium transition ${
                  view === v
                    ? v === "before"
                      ? "bg-ink-700 text-white"
                      : "bg-gradient-to-r from-brand-500 to-mint-500 text-white"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {v === "before" ? "Before（従来HP）" : "After（スマートサイト）"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {beforeAfterItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl border border-surface-100 bg-white p-6 shadow-soft"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-700">
                <ArrowLeftRight size={14} />
                {item.title}
              </div>
              <motion.div
                key={view + item.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                {view === "before" ? (
                  <div>
                    <div className="text-[10px] tracking-widest text-ink-300">
                      BEFORE
                    </div>
                    <p className="mt-2 text-base text-ink-500 line-through decoration-rose-300/60">
                      {item.before}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] tracking-widest text-emerald-600">
                      AFTER
                    </div>
                    <p className="mt-2 text-base font-semibold text-ink-900">
                      {item.after}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
