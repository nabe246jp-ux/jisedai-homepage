"use client";

import { motion } from "framer-motion";
import { Mail, Calendar, FileText, ArrowRight } from "lucide-react";

const cards = [
  {
    icon: Mail,
    title: "メールで相談",
    description: "24時間以内にご返信します",
    cta: "問い合わせフォームへ"
  },
  {
    icon: Calendar,
    title: "オンライン面談",
    description: "30分のカジュアル面談を予約",
    cta: "日程を選ぶ"
  },
  {
    icon: FileText,
    title: "資料ダウンロード",
    description: "サービス概要・料金表をPDFで",
    cta: "資料を受け取る"
  }
];

export default function ContactCTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-white py-28">
      <div className="absolute inset-0 bg-grid-fade opacity-70" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold tracking-widest text-brand-600">
            CONTACT
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            まずは、話してみませんか。
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500">
            ご検討段階に合わせて、3つの相談導線をご用意しました。お気軽にどうぞ。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.a
                key={c.title}
                href="#"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-surface-100 bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 text-white shadow-soft">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-ink-500">{c.description}</p>
                <div className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                  {c.cta}
                  <ArrowRight
                    size={12}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700"
          >
            すべての相談導線を見る
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
