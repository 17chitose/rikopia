// app/new/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ページを自動で切り替えるための道具です
import { savePost } from "@/lib/storage"; // さきほど作った保存用の命令を読み込みます

export default function NewPost() {
  const router = useRouter(); // ページ切り替えの機能を使えるようにします

  // 画面が入力項目を覚えておくための「state（ステイト）」を用意します
  const [author, setAuthor] = useState("");
  const [gummyName, setGummyName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [hardness, setHardness] = useState("ふつう");

  // 「レビューを投稿する」ボタンが押された時の処理です
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ページが勝手に再読み込みされるのを防ぎます
    
    // 必須入力のチェック
    if (!author || !gummyName || !text) {
      alert("すべての項目を入力してください！");
      return;
    }

    // 実際に「localStorage（ブラウザのメモ帳）」に保存します！
    savePost({
      author,
      gummyName,
      text,
      stars,
      hardness,
    });

    alert("レビューを投稿しました！🎉");

    // 保存が完了したら、トップページ（タイムライン）に自動で戻ります
    router.push("/");
  };

  return (
    <main>
      <div className="header-container">
        <h1 className="title">✍️ レビューを書く</h1>
        <p className="subtitle">新しく食べたグミの感想をみんなにシェアしよう！</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {/* ニックネーム入力欄 */}
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

        {/* グミの名前入力欄 */}
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

        {/* レビュー本文入力欄 */}
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

        {/* 面白くした5段階の評価 */}
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

        {/* 食感（かたさ） */}
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

        {/* 送信ボタン */}
        <button type="submit" className="submit-btn">レビューを投稿する</button>
      </form>

      {/* トップページへ戻るリンク */}
      <Link href="/" className="back-link">
        ← タイムラインに戻る
      </Link>
    </main>
  );
}
