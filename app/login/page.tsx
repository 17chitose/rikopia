// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // 🔌 接続窓口を読み込みます
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  
  // 入力されたメールアドレスとパスワードを覚えておく state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 「新規登録」画面か「ログイン」画面かを切り替えるための state
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // 送信ボタンが押された時の処理です
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("メールアドレスとパスワードを入力してください！");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // 🔑 【新規アカウント登録】
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("アカウントを作成しました！🎉\nさっそくログインしてみましょう！");
        setIsSignUp(false); // 登録できたらログイン画面に自動で切り替えます
      } else {
        // 🔑 【ログイン】
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        alert("ログインしました！🔑");
        router.push("/"); // 成功したらホーム（タイムライン）に戻ります
      }
    } catch (err: any) {
      alert(`エラーが発生しました: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="header-container">
        <h1 className="title">🔑 {isSignUp ? "アカウント登録" : "ログイン"}</h1>
        <p className="subtitle">グミレビューSNSへようこそ！</p>
      </div>

      <form onSubmit={handleAuth} className="form-card">
        {/* メールアドレス入力欄 */}
        <div className="form-group">
          <label className="label" htmlFor="email">メールアドレス</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            required
          />
        </div>

        {/* パスワード入力欄 */}
        <div className="form-group">
          <label className="label" htmlFor="password">パスワード</label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6文字以上"
            required
          />
        </div>

        {/* 送信ボタン */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "送信中..." : isSignUp ? "アカウントを作成する 🚀" : "ログインする 🔑"}
        </button>

        {/* 新規登録とログインの表示切り替えリンク */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem" }}>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#3b82f6", 
              cursor: "pointer", 
              textDecoration: "underline",
              fontSize: "0.85rem"
            }}
          >
            {isSignUp ? "すでにアカウントをお持ちの方（ログインへ）" : "初めての方はこちら（新規登録へ）"}
          </button>
        </div>
      </form>

      <Link href="/" className="back-link">
        ← タイムラインに戻る
      </Link>
    </main>
  );
}
