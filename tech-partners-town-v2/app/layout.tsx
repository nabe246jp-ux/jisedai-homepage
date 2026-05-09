import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TECH PARTNERS TOWN — 自律型動的ホームページ",
  description:
    "勝手に育つ町。時計台がリアルタイムに時を刻み、月が変われば季節装飾が舞い、数字は息づくように更新される。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
