// app/page.tsx
"use client"; // localStorageやuseStateを使うため、クライアントサイド（ブラウザ）で動かします

import React, { useState, useEffect } from "react";
import { getPosts, deletePost, type Post } from "@/lib/storage"; // メモ帳から取得・削除する命令を読み込みます

export default function Home() {
  // 投稿データを覚えておくための state です
  const [posts, setPosts] = useState<Post[]>([]);

  // 画面が表示された瞬間に1回だけデータを読み込みます
  useEffect(() => {
    const savedPosts = getPosts();
    setPosts(savedPosts);
  }, []);

  // 「削除」ボタンが押された時の処理です
  const handleDelete = (id: string) => {
    // 間違えて消してしまわないように、確認メッセージを出します
    if (confirm("このレビューを削除してもよろしいですか？")) {
      // メモ帳から削除して、新しくなった投稿リストを画面に再読み込みさせます
      const updated = deletePost(id);
      setPosts(updated);
    }
  };

  return (
    <main>
      {/* アプリのヘッダー部分（共通メニューができたので、すっきりさせました） */}
      <div className="header-container">
        <h1 className="title">🍬 みんなのタイムライン</h1>
        <p className="subtitle">お気に入りのグミをみんなでシェアしよう！</p>
      </div>

      {/* タイムライン（投稿一覧） */}
      <div className="timeline">
        {posts.map((post) => (
          <div key={post.id} className="card">
            {/* 🗑️ 削除ボタンを右上に配置しました */}
            <button
              onClick={() => handleDelete(post.id)}
              className="delete-btn"
              title="レビューを削除する"
            >
              🗑️ 削除
            </button>

            {/* 投稿の上の部分（名前や日付） */}
            <div className="card-header">
              <span className="author">👤 {post.author}</span>
              <span className="date">{post.createdAt}</span>
            </div>

            {/* 投稿の中身 */}
            <h2 className="gummy-name">🍬 {post.gummyName}</h2>
            <p className="review-text">{post.text}</p>

            {/* 投稿の下の部分（星評価やかたさ） */}
            <div className="rating-bar">
              <span className="stars">★ {"★".repeat(post.stars - 1)}</span>
              <span className="hardness">食感: {post.hardness}</span>
            </div>
          </div>
        ))}

        {/* もし投稿が1件も無くなった場合の表示 */}
        {posts.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-light)", marginTop: "40px" }}>
            まだレビューがありません。右上の「レビュー」から最初のレビューを投稿してみましょう！✍️
          </p>
        )}
      </div>
    </main>
  );
}
