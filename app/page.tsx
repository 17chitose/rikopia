// app/page.tsx
"use client"; // localStorageやuseStateを使うため、クライアントサイド（ブラウザ）で動かします

import React, { useState, useEffect } from "react";
import { getPosts, deletePost, likePost, getMyLikedPosts, type Post } from "@/lib/storage"; // getMyLikedPosts（いいね済みリスト取得）を追加で読み込みます

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [myLikedPosts, setMyLikedPosts] = useState<string[]>([]); // ❤️ 追加：自分がすでにいいね！した投稿IDのリストを覚えるstate

  // 画面が表示された瞬間にデータを読み込みます
  useEffect(() => {
    setPosts(getPosts());
    setMyLikedPosts(getMyLikedPosts()); // いいね済みリストも最初に読み込みます
  }, []);

  // 「削除」ボタンが押された時の処理
  const handleDelete = (id: string) => {
    if (confirm("このレビューを削除してもよろしいですか？")) {
      const updated = deletePost(id);
      setPosts(updated);
    }
  };

  // ❤️ 「いいね！」ボタンが押された時の処理
  const handleLike = (id: string) => {
    const updated = likePost(id);
    setPosts(updated);
    setMyLikedPosts(getMyLikedPosts()); // いいね！したあと、最新のいいねリストを再取得して画面を更新します
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
        {posts.map((post) => {
          // ❤️ 自分がこの投稿にすでにいいね！しているかをチェックします
          const isLiked = myLikedPosts.includes(post.id);

          return (
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

                {/* ❤️ いいね！ボタン（すでにいいね済みの場合は disabled にし、マークも ❤️ に変えます） */}
                <button
                  onClick={() => handleLike(post.id)}
                  className="like-btn"
                  disabled={isLiked}
                  title={isLiked ? "すでにいいね！しました" : "この投稿にいいね！をする"}
                >
                  {isLiked ? "❤️" : "🤍"} {post.likes || 0}
                </button>
              </div>
            </div>
          );
        })}

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
