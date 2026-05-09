"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { diagnosis, diagnosisResults } from "@/lib/mockData";

type Scores = { content: number; design: number; lead: number };

export default function Diagnosis() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>({ content: 0, design: 0, lead: 0 });
  const finished = step >= diagnosis.length;

  function handleChoose(score: Record<string, number>) {
    setScores((prev) => ({
      content: prev.content + (score.content || 0),
      design: prev.design + (score.design || 0),
      lead: prev.lead + (score.lead || 0)
    }));
    setStep((s) => s + 1);
  }

  function reset() {
    setStep(0);
    setScores({ content: 0, design: 0, lead: 0 });
  }

  // 結果を判定
  const winner = (Object.entries(scores) as [keyof Scores, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  const result = diagnosisResults[winner as keyof typeof diagnosisResults];

  return (
    <section id="diagnosis" className="bg-surface-50 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold tracking-widest text-brand-600">
            DIAGNOSIS
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
            30秒で、あなたに最適な答えを。
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-500">
            3つの質問にお答えください。御社にフィットする方向性を診断します。
          </p>
        </div>

        <div className="rounded-3xl border border-surface-100 bg-white p-8 shadow-soft md:p-10">
          {/* プログレス */}
          <div className="mb-8 flex items-center gap-2">
            {diagnosis.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition ${
                  i < step ? "bg-brand-500" : "bg-surface-100"
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-ink-300">
              {Math.min(step, diagnosis.length)} / {diagnosis.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!finished && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-xs text-ink-300">
                  Q{step + 1}.
                </div>
                <h3 className="mt-2 text-xl font-semibold text-ink-900 md:text-2xl">
                  {diagnosis[step].question}
                </h3>
                <div className="mt-6 grid gap-3">
                  {diagnosis[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleChoose(opt.score)}
                      className="group flex items-center justify-between rounded-2xl border border-surface-100 bg-white px-5 py-4 text-left transition hover:border-brand-300 hover:bg-brand-50"
                    >
                      <span className="text-sm text-ink-700 group-hover:text-brand-700">
                        {opt.label}
                      </span>
                      <span className="text-xs text-ink-300 group-hover:text-brand-600">
                        選ぶ →
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {finished && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-mint-400/30 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={14} /> 診断完了
                </div>
                <div className="mt-4 text-xs text-ink-300">
                  あなたのタイプは
                </div>
                <h3 className="mt-1 text-2xl font-bold text-ink-900 md:text-3xl">
                  {result.title}
                </h3>
                <p className="mt-3 text-base font-medium text-brand-700">
                  {result.headline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {result.body}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#contact"
                    className="rounded-full bg-ink-900 px-5 py-2.5 text-xs font-medium text-white shadow-soft transition hover:bg-brand-700"
                  >
                    結果をもとに相談する
                  </a>
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 rounded-full border border-surface-100 bg-white px-5 py-2.5 text-xs text-ink-500 transition hover:border-brand-300 hover:text-brand-600"
                  >
                    <RotateCcw size={12} /> もう一度診断する
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
