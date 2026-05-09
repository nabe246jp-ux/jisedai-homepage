"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const navItems = [
  { label: "Smart Data", href: "#smart-data" },
  { label: "Topics", href: "#smart-topics" },
  { label: "Experience", href: "#smart-experience" },
  { label: "診断", href: "#diagnosis" },
  { label: "AIナビ", href: "#ai-navi" }
];

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-surface-100 bg-white/80 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-mint-500 text-white shadow-soft">
            <Sparkles size={16} />
          </div>
          <span className="text-sm font-semibold tracking-wide text-ink-900">
            Smart Site
          </span>
        </a>

        <nav className="hidden gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink-500 transition hover:text-ink-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="rounded-full bg-ink-900 px-4 py-2 text-xs font-medium text-white shadow-soft transition hover:bg-brand-700"
        >
          相談する
        </a>
      </div>
    </motion.header>
  );
}
