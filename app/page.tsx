// app/page.tsx
"use client"; // localStorageやuseStateを使うため、クライアントサイド（ブラウザ）で動かします

import React, { useState, useEffect } from "react";
import { getPosts, deletePost, likePost, type Post } from "@/lib/storage"; // getPosts, deletePostに加えて、likePost（いいねを増やす命令）を追加で読み込みます

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
    if (confirm("このレビューを削除してもよろしいですか？")) {
      const updated = deletePost(id);
      setPosts(updated);
    }
  };

  // ❤️ 「いいね！」ボタンが押された時の処理です
  const handleLike = (id: string) => {
    // メモ帳のいいね！数を1つ増やし、最新の投稿リストを画面に再読み込みさせます
    const updated = likePost(id);
    setPosts(updated);
  };

  return (
    <main>
      {/* アプリのヘッダー部分 */}
      <div className="header-container">
        <h1 className="title">🍬 みんなのタイムライン</h1>
        <p className="subtitle">お気に入りのグミをみんなでシェアしよう！</p>
      </div>

      {/* タイムライン（投稿一覧） */}
      <div className="timeline">
        {posts.map((post) => (
          <div key={post.id} className="card">
            {/* 🗑️ 削除ボタン */}
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

              {/* ❤️ 「いいね！」ボタンを追加しました */}
              <button
                onClick={() => handleLike(post.id)}
                className="like-btn"
                title="この投稿にいいね！をする"
              >
                ❤️ {post.likes || 0}
              </button>
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
