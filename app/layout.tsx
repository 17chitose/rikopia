// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link"; // ページ移動のためのリンクパーツ
import "./globals.css";

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
        {/* 全ページで共通表示されるヘッダーメニュー */}
        <header className="global-header">
          <div className="header-inner">
            <Link href="/" className="logo-link">
              🍬 GumiReview
            </Link>
            <nav className="header-nav">
              <Link href="/" className="nav-item">
                🏠 ホーム
              </Link>
              <Link href="/recommend" className="nav-item">
                🎯 診断
              </Link>
              <Link href="/new" className="nav-item">
                ✍️ レビュー
              </Link>
              <Link href="/profile" className="nav-item">
                👤 プロフ
              </Link>
              {/* 🆕 追加：ログイン画面への移動ボタン */}
              <Link href="/login" className="nav-item">
                🔑 ログイン
              </Link>
            </nav>
          </div>
        </header>

        {/* ここに各ページの中身がはめ込まれます */}
        {children}
      </body>
    </html>
  );
}
