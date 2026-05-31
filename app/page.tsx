// app/page.tsx
import React from "react";
import Link from "next/link"; // ページを移動するための「Link（リンク）」を読み込みます

// グミの投稿データの「かたち（データ構造）」を定義します
type Post = {
  id: string;
  author: string;
  gummyName: string;
  text: string;
  stars: number;
  hardness: string; // 食感（かたさ）
  createdAt: string;
};

// 画面に表示する、サンプルの投稿データを3つ用意します
const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "グミすき人間",
    gummyName: "ぷにぷにぶどうグミ",
    text: "口に入れた瞬間のジューシーさが半端ない！周りのパウダーがほどよくすっぱくて、食べる手が止まらなくなります。パッケージも葡萄の形をしていて可愛い💜",
    stars: 5,
    hardness: "やわらかめ",
    createdAt: "2026-05-31 12:00",
  },
  {
    id: "2",
    author: "ハード派のタクミ",
    gummyName: "タフグミ コーラ味",
    text: "あごが鍛えられるくらいのかなりのハード系！噛みごたえ抜群で、すっきりした炭酸フレーバー。勉強中に集中したい時の相棒です。リピ確定！🔥",
    stars: 4,
    hardness: "超ハード",
    createdAt: "2026-05-31 11:30",
  },
  {
    id: "3",
    author: "ももいろ",
    gummyName: "じゅわピチピーチグミ",
    text: "まるで本物の桃を食べてるみたいな、ねっとりした贅沢な食感！ぷっくりしたハートの形をしていて見た目も映えます🍑✨",
    stars: 5,
    hardness: "ふつう",
    createdAt: "2026-05-31 10:15",
  },
];

export default function Home() {
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
        {INITIAL_POSTS.map((post) => (
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
      </div>
    </main>
  );
}
