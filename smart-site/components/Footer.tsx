"use client";

import { Sparkles } from "lucide-react";
import { company } from "@/lib/mockData";

export default function Footer() {
  return (
    <footer className="border-t border-surface-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-mint-500 text-white">
            <Sparkles size={12} />
          </div>
          <span className="text-sm font-semibold text-ink-900">Smart Site</span>
          <span className="text-xs text-ink-300">— {company.name}</span>
        </div>
        <div className="flex flex-wrap gap-5 text-xs text-ink-500">
          <a href="#" className="hover:text-ink-900">会社概要</a>
          <a href="#" className="hover:text-ink-900">プライバシー</a>
          <a href="#" className="hover:text-ink-900">利用規約</a>
          <a href="#contact" className="hover:text-ink-900">お問い合わせ</a>
        </div>
        <div className="text-[10px] text-ink-300">
          © {new Date().getFullYear()} {company.englishName}. Demo.
        </div>
      </div>
    </footer>
  );
}
