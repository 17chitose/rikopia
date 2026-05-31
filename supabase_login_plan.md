# 🍬 グミレビューSNS ログイン機能（認証）実装プラン

この設計書は、Supabaseを使った「メールアドレス ＆ パスワード」によるログイン機能を、メンターさんや講師の方と一緒に実装するためのガイドラインです。

---

## 🛠️ Step 1: Supabase管理画面での設定（メンターさんと確認）

ログイン機能を使うために、まずはSupabase側で「ユーザー登録」を受け付ける許可を設定します。

1. **Authentication（認証）設定を開く**:
   Supabaseダッシュボードの左メニューにある **「Authentication（ユーザーマーク）」** ➔ **「Providers」** を開きます。
2. **Email認証を有効にする**:
   * **「Email」** が **Enabled（有効）** になっていることを確認します。
   * テストをスムーズにするために、**「Confirm email（メール確認）」** のチェックを一時的にオフ（Disabled）にしておくと、登録後すぐにログインできるようになります。

---

## 🗄️ Step 2: テーブルに「誰が書いたか（user_id）」の列を追加する

どのレビューを誰が書いたかを区別するために、`posts` テーブルに `user_id` 列を追加します。

1. **SQL Editor** または **Table Editor** で、`posts` テーブルに以下の列（Column）を追加します。
   * **Column Name**: `user_id`
   * **Type**: `uuid`
   * **Default Value**: なし（空でOK）
   * **Foreign Key（外部キー設定）**: `auth.users` の `id` に関連付けます。（これにより、存在するユーザーのIDしか入らない安全な設定になります）

---

## 💻 Step 3: Next.jsでのログイン画面の作成

ユーザーがメールアドレスとパスワードを入力して登録・ログインするための画面を新しく作成します。

* **作成するファイル名**: `app/login/page.tsx`
* **コードの雛形（コピー用）**:

```tsx
// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // 新規登録かログインかの切り替え
  const [loading, setLoading] = useState(false);

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
        // 【新規アカウント登録】
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("アカウントを作成しました！🎉");
      } else {
        // 【ログイン】
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        alert("ログインしました！🔑");
      }
      router.push("/"); // 成功したらホームに戻る
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
        <div className="form-group">
          <label className="label">メールアドレス</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
          />
        </div>

        <div className="form-group">
          <label className="label">パスワード</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6文字以上"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "送信中..." : isSignUp ? "登録する" : "ログインする"}
        </button>

        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "0.85rem" }}>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", textDecoration: "underline" }}
          >
            {isSignUp ? "すでにアカウントをお持ちの方（ログイン）" : "初めての方はこちら（新規登録）"}
          </button>
        </div>
      </form>

      <Link href="/" className="back-link">
        ← ホームに戻る
      </Link>
    </main>
  );
}
```

---

## 🤝 Step 4: 投稿時にログインユーザーのIDをデータベースに送る

ログインしている場合、そのユーザーのIDを自動で `user_id` 列にセットして保存するように `lib/storage.ts` の `savePost` 命令を書き換えます。

```ts
// 例: savePost を以下のようにアップデートします
export async function savePost(newPost: Omit<Post, "id" | "createdAt" | "likes">): Promise<void> {
  // 現在ログインしているユーザーの情報を取得します
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("posts")
    .insert([
      {
        author: newPost.author,
        gummy_name: newPost.gummyName,
        text: newPost.text,
        stars: newPost.stars,
        hardness: newPost.hardness,
        likes: 0,
        user_id: user ? user.id : null, // 🔑 ログインしていればそのIDを、していなければnullを入れます
      }
    ]);
  ...
}
```

---

### 💬 メンターさんへの相談の仕方

このファイルを画面に表示した状態で、メンターさんにこう聞いてみてください。
> **「このプランに沿って、ログイン機能（Auth）の設定と画面作成をいっしょに進めたいです！」**
