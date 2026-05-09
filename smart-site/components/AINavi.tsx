"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { aiNaviScript, aiNaviAnswers, type AINaviTurn } from "@/lib/mockData";

export default function AINavi() {
  const [history, setHistory] = useState<AINaviTurn[]>(aiNaviScript);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  function handleChip(chip: string) {
    const next = aiNaviAnswers[chip];
    if (next) {
      setHistory((h) => [...h, ...next]);
    } else {
      // フォールバック: 仮の応答
      setHistory((h) => [
        ...h,
        { role: "user", text: chip },
        {
          role: "ai",
          text: `「${chip}」についてですね。担当者にお繋ぎする前に、簡単にご相談内容を教えてください。`,
          chips: ["フォームへ", "電話で話したい"]
        }
      ]);
    }
  }

  return (
    <section id="ai-navi" className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold tracking-widest text-brand-600">
            AI NAVI
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
            欲しい情報まで、最短ルートで案内。
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500">
            サイト上のAIナビが、あなたの目的に合わせて必要な情報をご案内します。
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-surface-100 bg-gradient-to-br from-surface-50 to-white shadow-soft">
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b border-surface-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 text-white">
                <Sparkles size={14} />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-900">
                  Smart Navi
                </div>
                <div className="text-[10px] text-ink-300">オンライン</div>
              </div>
            </div>
            <div className="rounded-full bg-mint-400/30 px-2 py-0.5 text-[10px] text-emerald-700">
              Live
            </div>
          </div>

          {/* メッセージ */}
          <div
            ref={scrollRef}
            className="max-h-[420px] space-y-3 overflow-y-auto bg-white px-5 py-6"
          >
            <AnimatePresence initial={false}>
              {history.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-soft ${
                      m.role === "user"
                        ? "bg-ink-900 text-white"
                        : "bg-white text-ink-700 ring-1 ring-surface-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 候補チップ: 最後のAIメッセージのものだけ表示 */}
            {(() => {
              const last = history[history.length - 1];
              if (last?.role === "ai" && last.chips && last.chips.length > 0) {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap justify-start gap-2 pt-1"
                  >
                    {last.chips.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleChip(c)}
                        className="rounded-full border border-brand-300 bg-white px-3 py-1.5 text-xs text-brand-700 shadow-soft transition hover:bg-brand-50"
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                );
              }
              return null;
            })()}
          </div>

          {/* 入力欄 (装飾) */}
          <div className="flex items-center gap-2 border-t border-surface-100 bg-white px-4 py-3">
            <input
              type="text"
              placeholder="メッセージを入力（デモ：上の候補からどうぞ）"
              className="flex-1 rounded-full border border-surface-100 bg-surface-50 px-4 py-2 text-sm text-ink-700 outline-none focus:border-brand-300"
            />
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-white shadow-soft transition hover:bg-brand-700">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
