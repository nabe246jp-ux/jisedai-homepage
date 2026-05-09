"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Zap, Globe2 } from "lucide-react";
import { company } from "@/lib/mockData";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* 背景: ドットグリッド + ぼんやりグラデ */}
      <div className="absolute inset-0 bg-grid-fade opacity-60" />
      <div className="absolute inset-0 bg-dot opacity-40" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        {/* 左: コピー */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-surface-100 bg-white px-3 py-1 text-xs text-ink-500 shadow-soft"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-mint-500" />
            次世代型ホームページ {company.tagline.replace("次世代型ホームページ", "")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink-900 md:text-5xl"
          >
            作って終わりのHPから、
            <br />
            <span className="text-gradient">賢く動く</span>
            スマートサイトへ。
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-ink-500"
          >
            会社の“今”を自動で伝える、次世代型ホームページ。
            訪問者ごとに最適な情報を出し分け、社内データと連携し、
            問い合わせまで自然につなぎます。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700"
            >
              相談する
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </a>
            <a
              href="#diagnosis"
              className="inline-flex items-center gap-2 rounded-full border border-surface-100 bg-white px-6 py-3 text-sm font-medium text-ink-700 shadow-soft transition hover:border-brand-300 hover:text-brand-600"
            >
              30秒診断をはじめる
            </a>
          </motion.div>

          <div className="mt-10 flex items-center gap-6 text-xs text-ink-300">
            <div className="flex items-center gap-1.5">
              <Activity size={14} /> リアルタイム連携
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={14} /> AIナビ標準搭載
            </div>
            <div className="flex items-center gap-1.5">
              <Globe2 size={14} /> 多言語対応
            </div>
          </div>
        </div>

        {/* 右: モック画面 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-3xl border border-surface-100 bg-white p-3 shadow-glow">
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 text-[10px] text-ink-300">
                smartsite.app/dashboard
              </span>
            </div>
            <div className="space-y-3 rounded-2xl bg-surface-50 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-ink-700">
                  会社の“今”
                </div>
                <div className="rounded-full bg-mint-400/30 px-2 py-0.5 text-[10px] text-emerald-700">
                  Live
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "支援企業", v: "1,284社", c: "from-brand-500 to-brand-700" },
                  { l: "満足度", v: "98.0%", c: "from-emerald-400 to-emerald-600" },
                  { l: "稼働率", v: "99.98%", c: "from-sky-400 to-brand-500" },
                  { l: "メンバー", v: "312名", c: "from-violet-400 to-brand-500" }
                ].map((m) => (
                  <div
                    key={m.l}
                    className="rounded-xl border border-surface-100 bg-white p-3"
                  >
                    <div className="text-[10px] text-ink-300">{m.l}</div>
                    <div
                      className={`mt-1 bg-gradient-to-r ${m.c} bg-clip-text text-lg font-bold text-transparent`}
                    >
                      {m.v}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-surface-100 bg-white p-3">
                <div className="text-[10px] text-ink-300">最新トピック</div>
                <div className="mt-1 text-xs text-ink-700">
                  第3回DXアワードを受賞しました
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.4, delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-brand-500 to-mint-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 装飾: 浮かぶカード */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-4 -top-4 hidden rounded-2xl border border-surface-100 bg-white px-4 py-3 shadow-soft md:block"
          >
            <div className="text-[10px] text-ink-300">AIナビ</div>
            <div className="text-xs text-ink-700">何かお手伝いしますか？</div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-surface-100 bg-white px-4 py-3 shadow-soft md:block"
          >
            <div className="text-[10px] text-ink-300">診断</div>
            <div className="text-xs text-ink-700">30秒であなたに最適な提案</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
