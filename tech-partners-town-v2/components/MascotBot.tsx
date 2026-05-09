"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";

/**
 * 右下の妖精マスコット「ルミナ」。
 * - SVGで描いた小さな妖精
 * - クリックで会話パネル展開
 * - 自然言語入力に対し、テンション高めにテンプレ返答
 *
 * 本物のAI連携が来るまでは、キーワードベースのルールで返答する。
 */

type ChatMsg = { who: "user" | "bot"; text: string };

export default function MascotBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const chat = useStore((s) => s.chat);
  const pushChat = useStore((s) => s.pushChat);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 開いた瞬間にフォーカス
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // 新着メッセージで一番下にスクロール
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    pushChat({ who: "user", text });
    setInput("");
    // 少し間を置いて返答
    setTimeout(() => {
      pushChat({ who: "bot", text: replyTo(text) });
    }, 500 + Math.random() * 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3">
      {/* 会話パネル */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-panel rounded-2xl p-4 w-[340px] mb-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] tracking-[0.3em] gold-text font-semibold">
                LUMINA — 町案内フェアリー
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-amber-100/60 hover:text-amber-100 text-sm"
              >
                ×
              </button>
            </div>

            <div
              ref={scrollRef}
              className="max-h-[280px] overflow-y-auto space-y-2 mb-3 pr-1"
            >
              {chat.map((m, i) => (
                <Bubble key={i} msg={m} />
              ))}
            </div>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="町について聞いてみて"
                className="flex-1 bg-black/30 text-amber-50 placeholder:text-amber-100/30 text-[12px] rounded-md px-3 py-2 border border-amber-200/15 focus:outline-none focus:border-amber-200/40"
              />
              <button
                onClick={send}
                className="px-3 py-2 rounded-md bg-gradient-to-br from-amber-400/30 to-amber-500/15 text-amber-50 text-[12px] tracking-wider border border-amber-200/30 hover:from-amber-400/45 hover:to-amber-500/25 transition"
              >
                送信
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* マスコット本体 */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-[88px] h-[88px] focus:outline-none"
        aria-label="フェアリーに話しかける"
      >
        {/* 後光 */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-amber-300/40 blur-2xl"
        />
        <FairySVG />
      </button>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMsg }) {
  const isBot = msg.who === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] text-[12px] leading-relaxed rounded-2xl px-3 py-2 ${
          isBot
            ? "bg-gradient-to-br from-amber-200/95 to-amber-100/90 text-stone-900"
            : "bg-amber-50/10 text-amber-50 border border-amber-200/20"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

// SVGの妖精
function FairySVG() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full drop-shadow-[0_8px_20px_rgba(245,207,138,0.45)]"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#fff8e0" />
          <stop offset="60%" stopColor="#f5cf8a" />
          <stop offset="100%" stopColor="#c89a55" />
        </radialGradient>
        <radialGradient id="wingGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="60%" stopColor="rgba(255, 220, 180, 0.55)" />
          <stop offset="100%" stopColor="rgba(255, 220, 180, 0)" />
        </radialGradient>
      </defs>

      {/* 翅（左右） */}
      <motion.g
        animate={{ scaleX: [1, 1.05, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        <ellipse cx="32" cy="42" rx="20" ry="14" fill="url(#wingGrad)" opacity="0.85" />
        <ellipse cx="68" cy="42" rx="20" ry="14" fill="url(#wingGrad)" opacity="0.85" />
        <ellipse cx="34" cy="58" rx="14" ry="10" fill="url(#wingGrad)" opacity="0.6" />
        <ellipse cx="66" cy="58" rx="14" ry="10" fill="url(#wingGrad)" opacity="0.6" />
      </motion.g>

      {/* 身体 */}
      <circle cx="50" cy="52" r="18" fill="url(#bodyGrad)" />

      {/* 顔 */}
      <ellipse cx="50" cy="49" r="9" fill="#fff8e0" />
      {/* 目 */}
      <motion.circle
        cx="46.5"
        cy="50"
        r="1.6"
        fill="#1a1208"
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
        style={{ transformOrigin: "46.5px 50px" }}
      />
      <motion.circle
        cx="53.5"
        cy="50"
        r="1.6"
        fill="#1a1208"
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
        style={{ transformOrigin: "53.5px 50px" }}
      />
      {/* ほっぺ */}
      <circle cx="44" cy="53" r="1.6" fill="#f8b5cc" opacity="0.7" />
      <circle cx="56" cy="53" r="1.6" fill="#f8b5cc" opacity="0.7" />
      {/* 口 */}
      <path d="M 47 54 Q 50 56.5 53 54" stroke="#1a1208" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* 髪 */}
      <path d="M 40 44 Q 50 36 60 44 Q 56 40 50 41 Q 44 40 40 44 Z" fill="#f5cf8a" />

      {/* 光の粒 */}
      <motion.g
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <circle cx="22" cy="30" r="0.9" fill="#fff" />
        <circle cx="80" cy="36" r="0.7" fill="#fff" />
        <circle cx="78" cy="72" r="0.9" fill="#fff" />
        <circle cx="20" cy="68" r="0.7" fill="#fff" />
      </motion.g>

      {/* 杖 */}
      <line x1="62" y1="62" x2="74" y2="78" stroke="#a87a4f" strokeWidth="1.2" strokeLinecap="round" />
      <motion.g animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ transformOrigin: "74px 78px" }}>
        <circle cx="74" cy="78" r="2.2" fill="#fef3a0" />
        <circle cx="74" cy="78" r="1.0" fill="#fff" />
      </motion.g>
    </motion.svg>
  );
}

// ----- 返答ロジック -----

function replyTo(text: string): string {
  const t = text.toLowerCase();

  if (/(売上|profit|利益|売り上げ|うりあげ)/.test(text)) {
    return "売上は今日も右肩上がり！ 経理チームの皆も「えっ、今月もまた更新かよ」ってザワついてたよ。すごいよね、本気で。";
  }
  if (/(社員|人数|何人|社員数)/.test(text)) {
    return "社員数はじわじわ増殖中！ 採用ビルから毎日新しい仲間が降ってくる感覚。最強のチームが日に日に最強を更新してるよ。";
  }
  if (/(時計|時間|何時|clock|time)/.test(text)) {
    return "中央の時計台、リアルタイムで動いてるの気づいた？ 秒針までちゃんと刻んでるよ。夜になると文字盤が金色に光るから絶対見て！";
  }
  if (/(季節|月|秋|春|夏|冬|桜|紅葉|雪|蛍)/.test(text)) {
    return "町は月が変わると勝手に衣替えするんだ。桜が舞ったり、紅葉が散ったり、雪が降ったり。デモコントロールで＋1ヶ月押してみて、町ごと別モードになるから！";
  }
  if (/(ai|エーアイ|人工知能|アシスタント)/.test(text)) {
    return "稼働中AIは町の見えないところでフル稼働中！ メール下書きから資料作成まで、社員の手を10倍速にしてるよ。盛ってないよ、たぶん。";
  }
  if (/(訪問|来た|アクセス|来訪)/.test(text)) {
    return "今日もたくさんの人が町を覗きに来てるよ。サイトじゃなくて『町』って呼ぶの、もう普通の感覚になってきたでしょ？";
  }
  if (/(研修|教育|学習|スキル)/.test(text)) {
    return "研修棟ではAWS・Azure・Ciscoのハンズオンが毎日開催中！ 受講者は『気づいたら手が勝手に動いてた』って震えながら帰っていくよ。";
  }
  if (/(福利|休み|休日|休暇|有給)/.test(text)) {
    return "年間休日125日！ 28種類の福利厚生！ 数えるのが追いつかなくて、もう町の住人は何が福利厚生で何がデフォかわからなくなってる。最高だね。";
  }
  if (/(会社|概要|設立|history|沿革)/.test(text)) {
    return "2005年設立、社員1820名のテックパートナーズ。20年の歴史が町の隅々まで染み込んでるよ。建物の銘板、ぜひ近づいて見てね！";
  }
  if (/(誰|あなた|おまえ|名前|きみ|何者)/.test(text)) {
    return "私はルミナ！ 町を案内するフェアリーだよ。杖を振ると豆知識が出てくるけど、99%は私の妄想。残り1%は本当！ 信じるかは君次第！";
  }
  if (/(こんにちは|やあ|hi|hello|こんばんは|おはよう)/.test(text)) {
    return "やっほー！ 来てくれてうれしい。町をぐるっと見てから、なんでも聞いてね。質問が雑であればあるほど私はテンション上がるよ！";
  }
  if (/(ありがとう|thanks|サンキュー|どうも)/.test(text)) {
    return "こちらこそ！ また来てね、町は毎日ちょっとずつ顔を変えてるから、明日見たら「あれ？」ってなるかも。";
  }

  // デフォルト
  const fallbacks = [
    "面白い質問！ 答えはたぶん『すごい』に集約される。詳しく聞きたかったら、もうちょっと具体的に教えて？",
    "うーん、その質問、町中の住人を集めて議論してもいい話題だね。簡単に言うと『ぜんぶ最高』だよ。",
    "それ、まさに昨日も町長が話してたんだよね。結論：このタウン、止まらない。",
    "良い角度で来たね！ 答えはまだ町の地下倉庫にしまってあって、ちょっと取りに行ってくる…冗談、たぶん最高ってこと！",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
