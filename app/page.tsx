// app/page.tsx
"use client"; // localStorageやuseStateを使うため、クライアントサイド（ブラウザ）で動かします

import React, { useState, useEffect } from "react";
import { getPosts, deletePost, likePost, getMyLikedPosts, type Post } from "@/lib/storage";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [myLikedPosts, setMyLikedPosts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "likes">("newest");

  // 🔌 変更：Supabaseから非同期でデータを取得して画面にセットする関数を作ります
  const loadData = async () => {
    const savedPosts = await getPosts(); // データの受信を待ちます
    setPosts(savedPosts);
    setMyLikedPosts(getMyLikedPosts());
  };

  // 画面が表示された瞬間にデータを取得します
  useEffect(() => {
    loadData();
  }, []);

  // 🔌 変更：「削除」ボタンが押された時の非同期処理
  const handleDelete = async (id: string) => {
    if (confirm("このレビューを削除してもよろしいですか？")) {
      await deletePost(id); // データベースからの削除完了を待ちます
      await loadData(); // 最新のデータを再読み込みします
    }
  };

  // 🔌 変更：「いいね！」ボタンが押された時の非同期処理
  const handleLike = async (id: string) => {
    await likePost(id); // データベースのいいね数更新を待ちます
    await loadData(); // 最新のデータを再読み込みします
  };

  // 選択されている基準に従って、投稿データを瞬時に並び替えます
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "likes") {
      return (b.likes || 0) - (a.likes || 0);
    }
    return b.id.localeCompare(a.id);
  });

  return (
    <main>
      {/* アプリのヘッダー部分 */}
      <div className="header-container">
        <h1 className="title">🍬 みんなのタイムライン</h1>
        <p className="subtitle">お気に入りのグミをみんなでシェアしよう！</p>
      </div>

      {/* 並び替え用のスイッチボタンバー */}
      <div className="sort-bar">
        <button
          onClick={() => setSortBy("newest")}
          className={`sort-btn ${sortBy === "newest" ? "active" : ""}`}
        >
          🆕 最新順
        </button>
        <button
          onClick={() => setSortBy("likes")}
          className={`sort-btn ${sortBy === "likes" ? "active" : ""}`}
        >
          🔥 人気順
        </button>
      </div>

      {/* タイムライン */}
      <div className="timeline">
        {sortedPosts.map((post) => {
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

              {/* 投稿の上の部分 */}
              <div className="card-header">
                <span className="author">👤 {post.author}</span>
                <span className="date">{post.createdAt}</span>
              </div>

              {/* 投稿の中身 */}
              <h2 className="gummy-name">🍬 {post.gummyName}</h2>
              <p className="review-text">{post.text}</p>

              {/* 投稿の下の部分 */}
              <div className="rating-bar">
                <span className="stars">★ {"★".repeat(post.stars - 1)}</span>
                <span className="hardness">食感: {post.hardness}</span>

                {/* ❤️ いいね！ボタン */}
                <button
                  onClick={() => handleLike(post.id)}
                  className={`like-btn ${isLiked ? "liked" : ""}`}
                  title={isLiked ? "いいね！を取り消す" : "この投稿にいいね！をする"}
                >
                  {isLiked ? "❤️" : "🤍"} {post.likes || 0}
                </button>
              </div>
            </div>
          );
        })}

        {/* もし投稿が1件も無くなった場合の表示 */}
        {sortedPosts.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-light)", marginTop: "40px" }}>
            まだレビューがありません。右上の「レビュー」から最初のレビューを投稿してみましょう！✍️
          </p>
        )}
      </div>
    </main>
  );
}
