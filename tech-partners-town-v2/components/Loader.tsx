"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="loader-wrap">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-amber-200/30 border-t-amber-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="loader-text">TECH PARTNERS TOWN</div>
        <div className="text-[10px] tracking-[0.3em] text-amber-100/40">
          BUILDING THE TOWN…
        </div>
      </div>
    </div>
  );
}
