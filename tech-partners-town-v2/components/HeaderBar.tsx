"use client";

import { motion } from "framer-motion";

export default function HeaderBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-30 px-8 py-5 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,207,138,0.9)] animate-pulse-soft" />
        <div className="font-display text-[15px] tracking-[0.4em] gold-text font-semibold">
          TECH PARTNERS TOWN
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 text-[11px] tracking-[0.3em] text-amber-100/60">
        <span>RESEARCH</span>
        <span>BUSINESS</span>
        <span>BENEFIT</span>
        <span>ABOUT</span>
      </div>

      <div className="text-[10px] tracking-[0.3em] text-amber-100/45">
        v2 — AUTONOMOUS DEMO
      </div>
    </motion.header>
  );
}
