"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function FloatingCTA() {
  return (
    <motion.a
      href="#contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-mint-500 px-5 py-3 text-sm font-medium text-white shadow-glow transition hover:scale-105"
    >
      <MessageCircle size={16} />
      相談する
    </motion.a>
  );
}
