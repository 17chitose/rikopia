// components/Header.tsx
"use client"; // 状態（state）の変化をキャッチするため、クライアントサイドで動かします

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // 🔌 接続窓口を読み込みます

export default function Header() {
  const router = useRouter();
  
  // 現在ログインしているユーザー情報を覚えておく state（最初はログインしていない＝null）
  const [user, setUser] = useState<any>(null);

  // 画面が表示された瞬間から、ログイン状態の監視（センサー）を開始します
  useEffect(() => {
    // 1. ページを開いた時点でのログイン情報を取得してセットします
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getInitialSession();

    // 2. ログインしたり、ログアウトしたりした「変化の瞬間」を検知して状態を更新します
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // ページを閉じた時にセンサーを安全にストップさせます（クリーンアップ）
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 🚪「ログアウト」ボタンが押された時の処理です
  const handleLogout = async () => {
    if (confirm("ログアウトしてもよろしいですか？")) {
      const { error } = await supabase.auth.signOut(); // Supabaseからログアウトします
      if (error) {
        alert(`ログアウトに失敗しました: ${error.message}`);
      } else {
        alert("ログアウトしました！🚪 またね！");
        router.push("/"); // ログアウトしたら自動的にホーム（タイムライン）に戻します
      }
    }
  };

  return (
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
          
          {/* 🔑 ログインしているかどうかに応じて、表示を自動で切り替えます */}
          {user ? (
            <button onClick={handleLogout} className="logout-btn" title="ログアウトする">
              🚪 ログアウト
            </button>
          ) : (
            <Link href="/login" className="nav-item">
              🔑 ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
