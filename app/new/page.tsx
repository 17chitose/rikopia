// app/new/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react"; // Suspenseを追加
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParams（URLパラメータの読み取り機能）を追加
import { savePost, getProfile } from "@/lib/storage";

// 入力フォームの本体部分を別のコンポーネントとして切り分けます
function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // URLのパラメータ（?gummy=〇〇）を読み取ります

  const [author, setAuthor] = useState("");
  const [gummyName, setGummyName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [hardness, setHardness] = useState("ふつう");

  // ページを開いた瞬間に実行する処理
  useEffect(() => {
    // 1. プロフィール名を取得してセット
    const profile = getProfile();
    if (profile && profile.name) {
      setAuthor(profile.name);
    }

    // 2. 🆕 もしURLに「?gummy=〇〇」という指定があれば、グミの名前に自動入力します！
    const gummyParam = searchParams.get("gummy");
    if (gummyParam) {
      setGummyName(gummyParam);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author || !gummyName || !text) {
      alert("すべての項目を入力してください！");
      return;
    }

    savePost({
      author,
      gummyName,
      text,
      stars,
      hardness,
    });

    alert("レビューを投稿しました！🎉");
    router.push("/");
  };

  return (
    <main>
      <div className="header-container">
        <h1 className="title">✍️ レビューを書く</h1>
        <p className="subtitle">新しく食べたグミの感想をみんなにシェアしよう！</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {/* ニックネーム */}
        <div className="form-group">
          <label className="label" htmlFor="author">ニックネーム</label>
          <input
            id="author"
            className="input"
            type="text"
            placeholder="例: グミマスター"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        {/* グミの名前 */}
        <div className="form-group">
          <label className="label" htmlFor="gummyName">グミの名前</label>
          <input
            id="gummyName"
            className="input"
            type="text"
            placeholder="例: ピュレグミ レモン味"
            value={gummyName}
            onChange={(e) => setGummyName(e.target.value)}
          />
        </div>

        {/* レビュー本文 */}
        <div className="form-group">
          <label className="label" htmlFor="text">レビュー内容</label>
          <textarea
            id="text"
            className="textarea"
            placeholder="味や食感、パッケージの感想を教えてね！"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* 評価 */}
        <div className="form-group">
          <label className="label" htmlFor="stars">おすすめ度 (5段階)</label>
          <select
            id="stars"
            className="select"
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
          >
            <option value="5">🦄 ★★★★★ (神グミ！見つけたら即買い)</option>
            <option value="4">✨ ★★★★☆ (超うまい！スタメン入り確定)</option>
            <option value="3">😋 ★★★☆☆ (美味しい！普通にアリ)</option>
            <option value="2">😅 ★★☆☆☆ (悪くはないが普通かも…)</option>
            <option value="1">🙃 ★☆☆☆☆ (ちょっと私のお口には合わなかった…)</option>
          </select>
        </div>

        {/* 食感 */}
        <div className="form-group">
          <label className="label" htmlFor="hardness">食感（かたさ）</label>
          <select
            id="hardness"
            className="select"
            value={hardness}
            onChange={(e) => setHardness(e.target.value)}
          >
            <option value="やわらかめ">やわらかめ (ジュレ入りなど)</option>
            <option value="ふつう">ふつう</option>
            <option value="かため">かため</option>
            <option value="ハード">ハード (噛みごたえあり)</option>
            <option value="超ハード">超ハード (タフグミなど)</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">レビューを投稿する</button>
      </form>

      <Link href="/" className="back-link">
        ← タイムラインに戻る
      </Link>
    </main>
  );
}

// 🆕 メインのページコンポーネントです（useSearchParamsの動作エラーを防ぐため、Suspenseで包み込みます）
export default function NewPost() {
  return (
    <Suspense fallback={
      <main style={{ textAlign: "center", padding: "40px" }}>
        <p>画面を準備中...</p>
      </main>
    }>
      <NewPostForm />
    </Suspense>
  );
}
