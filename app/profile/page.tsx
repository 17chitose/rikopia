// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getProfile, saveProfile, type Profile } from "@/lib/storage"; // メモ帳からプロフィールの読み書き命令をインポートします

export default function ProfilePage() {
  // 現在保存されているプロフィール情報
  const [profile, setProfile] = useState<Profile>({
    name: "",
    favoriteGummy: "",
    bio: "",
  });

  // 編集フォームに入力中の値
  const [name, setName] = useState("");
  const [favoriteGummy, setFavoriteGummy] = useState("");
  const [bio, setBio] = useState("");

  // 「今、編集モードかどうか」を記憶する state です（最初は表示モード）
  const [isEditing, setIsEditing] = useState(false);

  // 画面が表示された瞬間に、保存されているプロフィールデータを読み込んでセットします
  useEffect(() => {
    const savedProfile = getProfile();
    setProfile(savedProfile);
    setName(savedProfile.name);
    setFavoriteGummy(savedProfile.favoriteGummy);
    setBio(savedProfile.bio);
  }, []);

  // 「保存する」ボタンが押された時の処理です
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("ニックネームを入力してください！");
      return;
    }

    const updatedProfile: Profile = {
      name,
      favoriteGummy,
      bio,
    };

    // メモ帳（localStorage）に上書き保存します
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setIsEditing(false); // 編集モードを終了して表示モードに戻ります
    alert("プロフィールを更新しました！✨");
  };

  return (
    <main>
      <div className="header-container">
        <h1 className="title">👤 プロフィール</h1>
        <p className="subtitle">あなたのグミへの愛をみんなに伝えるための自己紹介カードです</p>
      </div>

      {/* 【表示モード】編集中でないときは、自己紹介カードを表示します */}
      {!isEditing ? (
        <div>
          <div className="profile-card">
            <span className="profile-avatar">🦖</span>
            <h2 className="profile-name">{profile.name || "名前未設定"}</h2>
            <div className="profile-gummy">🍭 推しグミ: {profile.favoriteGummy || "未登録"}</div>
            <p className="profile-bio">{profile.bio || "自己紹介がまだありません。"}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="submit-btn"
            style={{ background: "#4b5563" }}
          >
            ✏️ プロフィールを編集する
          </button>
        </div>
      ) : (
        /* 【編集モード】編集中のときは、入力用フォームを表示します */
        <form onSubmit={handleSubmit} className="form-card">
          {/* ニックネーム入力 */}
          <div className="form-group">
            <label className="label" htmlFor="profile-name">ニックネーム</label>
            <input
              id="profile-name"
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: グミマスター"
            />
          </div>

          {/* いちばん好きなグミ入力 */}
          <div className="form-group">
            <label className="label" htmlFor="favorite-gummy">いちばん好きなグミ（推しグミ）</label>
            <input
              id="favorite-gummy"
              className="input"
              type="text"
              value={favoriteGummy}
              onChange={(e) => setFavoriteGummy(e.target.value)}
              placeholder="例: ピュレグミ レモン味"
            />
          </div>

          {/* 自己紹介入力 */}
          <div className="form-group">
            <label className="label" htmlFor="profile-bio">自己紹介</label>
            <textarea
              id="profile-bio"
              className="textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="グミのこだわりや、好きな食感を書いてみてね！"
            />
          </div>

          {/* 保存とキャンセルのボタン */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="submit-btn">
              💾 保存する
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="submit-btn"
              style={{ background: "#9ca3af", width: "40%" }}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
