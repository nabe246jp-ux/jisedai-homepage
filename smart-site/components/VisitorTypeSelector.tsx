"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Users, UserPlus, ArrowRight } from "lucide-react";
import { recommendations, type VisitorType } from "@/lib/mockData";

type Props = {
  visitor: VisitorType;
  onChange: (v: VisitorType) => void;
};

const tabs: { key: VisitorType; label: string; icon: typeof Briefcase }[] = [
  { key: "new", label: "新規のお客様", icon: UserPlus },
  { key: "existing", label: "既存のお客様", icon: Users },
  { key: "recruit", label: "求職中の方", icon: Briefcase }
];

export default function VisitorTypeSelector({ visitor, onChange }: Props) {
  const items = recommendations[visitor];

  return (
    <section id="visitor" className="bg-surface-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-semibold tracking-widest text-brand-600">
              VISITOR
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
              あなたに合わせて、表示が変わります。
            </h2>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              ご来訪の目的を選んでください。下のおすすめが切り替わります。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = visitor === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onChange(t.key)}
                  className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-ink-900 bg-ink-900 text-white shadow-soft"
                      : "border-surface-100 bg-white text-ink-500 hover:border-brand-300 hover:text-brand-600"
                  }`}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.a
                key={`${visitor}-${item.title}`}
                href={item.href}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="group rounded-2xl border border-surface-100 bg-white p-6 shadow-soft transition hover:border-brand-300 hover:shadow-glow"
              >
                <div className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                  {item.badge}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {item.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1 text-xs text-brand-600">
                  詳しく見る
                  <ArrowRight
                    size={12}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
