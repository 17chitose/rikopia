// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header"; // 🆕 切り出した「賢いヘッダーパーツ」をインポートします

export const metadata: Metadata = {
  title: "🍬 GumiReview SNS",
  description: "お気に入りのグミをみんなでシェアしよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {/* 🆕 動的にログイン・ログアウトを自動で切り替えるヘッダーをはめ込みます */}
        <Header />

        {/* ここに各ページの中身がはめ込まれます */}
        {children}
      </body>
    </html>
  );
}
