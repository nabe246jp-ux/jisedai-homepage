import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "スマートサイト | 作って終わりのHPから、賢く動くスマートサイトへ",
  description:
    "会社の“今”を自動で伝える、次世代型ホームページ。スマートサイトのコンセプトデモです。"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-white text-ink-900 antialiased">{children}</body>
    </html>
  );
}
