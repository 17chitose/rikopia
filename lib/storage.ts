// lib/storage.ts
import { supabase } from "./supabase"; // 🔌 追記：さきほど作ったSupabaseへの窓口を読み込みます

// レビュー投稿のデータの「かたち」を定義します
export type Post = {
  id: string;
  author: string;
  gummyName: string;
  text: string;
  stars: number;
  hardness: string; // かたさ
  createdAt: string; // 投稿した時間
  likes: number; // いいね！の数
};

// プロフィールのデータの「かたち」を定義します
export type Profile = {
  name: string;
  favoriteGummy: string;
  bio: string;
  avatar: string; // 👤 絵文字アバター
};

// メモ帳の引き出しに貼るラベルの名前です
const PROFILE_KEY = "gummy_profile";
const LIKED_POSTS_KEY = "my_liked_posts"; // 自分がいいねした投稿IDを保存するキー

// プロフィールの初期データ
const DEFAULT_PROFILE: Profile = {
  name: "グミ初心者",
  favoriteGummy: "フィットチーネグミ（仮）",
  bio: "グミが大好きです！これからいろんなレビューを投稿します！",
  avatar: "🦖",
};

/* ━━━━━━━ 投稿（ポスト）の処理（🔌 Supabase対応に書き換え） ━━━━━━━ */

// 🔌【読み込み】Supabaseのデータベースからすべての投稿を読み出す関数
export async function getPosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from("posts") // あなたが作った「posts」テーブルから
      .select("*")   // すべての項目を取得し
      .order("created_at", { ascending: false }); // 投稿時間が新しい順（降順）に並び替えます

    if (error) {
      console.error("データ取得エラー:", error);
      return [];
    }

    if (!data) return [];

    // Supabaseのテーブルのカラム名（スネークケースなど）を、アプリで使う形式に変換します
    return data.map((item) => ({
      id: item.id.toString(),
      author: item.author || "名無しさん",
      gummyName: item.gummy_name || "",
      text: item.text || "",
      stars: item.stars || 5,
      hardness: item.hardness || "ふつう",
      // 日時を日本のタイムゾーンの綺麗な文字列にフォーマットします
      createdAt: item.created_at ? new Date(item.created_at).toLocaleString("ja-JP") : "",
      likes: item.likes || 0,
    }));
  } catch (err) {
    console.error("接続エラー:", err);
    return [];
  }
}

// 🔌【保存】新しい投稿をSupabaseのデータベースに保存する関数
export async function savePost(newPost: Omit<Post, "id" | "createdAt" | "likes">): Promise<void> {
  try {
    const { error } = await supabase
      .from("posts")
      .insert([
        {
          author: newPost.author,
          gummy_name: newPost.gummyName,
          text: newPost.text,
          stars: newPost.stars,
          hardness: newPost.hardness,
          likes: 0, // 新しい投稿はいいね！ 0個からスタート
        }
      ]);

    if (error) {
      console.error("保存エラー:", error);
      throw error;
    }
  } catch (err) {
    console.error("保存接続エラー:", err);
    throw err;
  }
}

// 🔌【削除】指定された投稿をSupabaseのデータベースから削除する関数
export async function deletePost(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", Number(id)); // id列が一致するものを消去します

    if (error) {
      console.error("削除エラー:", error);
      throw error;
    }
  } catch (err) {
    console.error("削除接続エラー:", err);
    throw err;
  }
}

// 【いいね済みリスト取得】自分がいいねした投稿IDのリストを取得する関数（ブラウザのメモ帳に残します）
export function getMyLikedPosts(): string[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LIKED_POSTS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

// 🔌【いいね！トグル】いいね！の追加と取り消し（Supabase対応）
export async function likePost(id: string): Promise<void> {
  try {
    const likedIds = getMyLikedPosts();
    const isAlreadyLiked = likedIds.includes(id);

    let updatedLikedIds: string[];
    let likesDiff: number;

    if (isAlreadyLiked) {
      updatedLikedIds = likedIds.filter((likedId) => likedId !== id);
      likesDiff = -1;
    } else {
      updatedLikedIds = [...likedIds, id];
      likesDiff = 1;
    }

    // 1. ローカルのいいね済みリストを更新（自分だけのメモ）
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(updatedLikedIds));

    // 2. Supabase上の今のいいね数を取得して、更新します
    // まず今の投稿データを取得
    const { data: postData, error: fetchError } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", Number(id))
      .single();

    if (fetchError || !postData) {
      console.error("いいね数取得エラー:", fetchError);
      return;
    }

    const currentLikes = postData.likes || 0;
    const newLikes = Math.max(0, currentLikes + likesDiff);

    // Supabase上のいいね数（likes）を更新します
    const { error: updateError } = await supabase
      .from("posts")
      .update({ likes: newLikes })
      .eq("id", Number(id));

    if (updateError) {
      console.error("いいね更新エラー:", updateError);
      throw updateError;
    }
  } catch (err) {
    console.error("いいね接続エラー:", err);
  }
}

/* ━━━━━━━ プロフィールの処理（ローカルでキープ） ━━━━━━━ */

// 【プロフィール取得】メモ帳からプロフィールを読み込む関数
export function getProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  
  const data = localStorage.getItem(PROFILE_KEY);
  if (!data) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  
  const profile = JSON.parse(data);
  if (!profile.avatar) {
    profile.avatar = "🦖";
  }
  return profile;
}

// 【プロフィール保存】プロフィールを新しく上書き保存する関数
export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
