// app/page.tsx
"use client"; // localStorageやuseStateを使うため、クライアントサイド（ブラウザ）で動かします

import React, { useState, useEffect } from "react";
import Link from "next/link"; // ページを移動するための「Link（リンク）」を読み込みます
import { getPosts, type Post } from "@/lib/storage"; // メモ帳から読み出す関数と、データの型を読み込みます

export default function Home() {
  // 投稿データを覚えておくための state（ステイト）です。最初は空のリストにしておきます
  const [posts, setPosts] = useState<Post[]>([]);

  // 画面が最初に表示された「瞬間」に1回だけ実行される処理です
  useEffect(() => {
    // メモ帳（localStorage）からすべてのレビューデータを読み込んで、画面に覚えさせます
    const savedPosts = getPosts();
    setPosts(savedPosts);
  }, []);

  return (
    <main>
      {/* アプリのヘッダー部分 */}
      <div className="header-container">
        <div className="nav-bar">
          <h1 className="title">🍬 GumiReview SNS</h1>
          {/* レビューを書くページにジャンプするボタンリンクです */}
          <Link href="/new" className="btn-link">
            ✍️ レビューを書く
          </Link>
        </div>
        <p className="subtitle">お気に入りのグミをみんなでシェアしよう！</p>
      </div>

      {/* タイムライン（投稿一覧） */}
      <div className="timeline">
        {posts.map((post) => (
          <div key={post.id} className="card">
            {/* 投稿の上の部分（名前や日付） */}
            <div className="card-header">
              <span className="author">👤 {post.author}</span>
              <span className="date">{post.createdAt}</span>
            </div>

            {/* 投稿の中身（グミの名前とレビュー内容） */}
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
            まだレビューがありません。最初のレビューを投稿してみましょう！✍️
          </p>
        )}
      </div>
    </main>
  );
}
