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
        {/* 全ページで共通表示されるヘッダーメニューです */}
        <header className="global-header">
          <div className="header-inner">
            <Link href="/" className="logo-link">
              🍬 GumiReview
            </Link>
            <nav className="header-nav">
              <Link href="/" className="nav-item">
                🏠 ホーム
              </Link>
              {/* 🆕 追加：グミ診断ゲームへのリンクです */}
              <Link href="/recommend" className="nav-item">
                🎯 診断
              </Link>
              <Link href="/new" className="nav-item">
                ✍️ レビュー
              </Link>
              <Link href="/profile" className="nav-item">
                👤 プロフ
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
