// lib/storage.ts

// レビュー投稿のデータの「かたち」を定義します
export type Post = {
  id: string;
  author: string;
  gummyName: string;
  text: string;
  stars: number;
  hardness: string; // かたさ
  createdAt: string; // 投稿した時間
};

// プロフィールのデータの「かたち」を定義します
export type Profile = {
  name: string;
  favoriteGummy: string;
  bio: string;
};

// メモ帳の引き出しに貼るラベルの名前です
const STORAGE_KEY = "gummy_reviews_posts";
const PROFILE_KEY = "gummy_profile";

// 最初の1回目の時に表示する、サンプル用の投稿データです
const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "グミすき人間",
    gummyName: "ぷにぷにぶどうグミ",
    text: "口に入れた瞬間のジューシーさが半端ない！周りのパウダーがほどよくすっぱくて、食べる手が止まらなくなります。パッケージも葡萄の形をしていて可愛い💜",
    stars: 5,
    hardness: "やわらかめ",
    createdAt: "2026/05/31 12:00",
  },
  {
    id: "2",
    author: "ハード派 of タクミ",
    gummyName: "タフグミ コーラ味",
    text: "あごが鍛えられるくらいのかなりのハード系！噛みごたえ抜群で、すっきりした炭酸フレーバー。勉強中に集中したい時の相棒です。リピ確定！🔥",
    stars: 4,
    hardness: "超ハード",
    createdAt: "2026/05/31 11:30",
  },
];

// プロフィールの初期データ（まだ登録していない時の名前）
const DEFAULT_PROFILE: Profile = {
  name: "グミ初心者",
  favoriteGummy: "フィットチーネグミ（仮）",
  bio: "グミが大好きです！これからいろんなレビューを投稿します！",
};

/* ━━━━━━━ 投稿（ポスト）の処理 ━━━━━━━ */

// 【読み込み】メモ帳からすべての投稿を読み出す関数
export function getPosts(): Post[] {
  if (typeof window === "undefined") return INITIAL_POSTS;

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  return JSON.parse(data);
}

// 【保存】新しい投稿をメモ帳に新しく書き加える関数
export function savePost(newPost: Omit<Post, "id" | "createdAt">): Post {
  const posts = getPosts();
  
  const now = new Date();
  const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const post: Post = {
    ...newPost,
    id: Date.now().toString(),
    createdAt: formattedDate,
  };

  const updatedPosts = [post, ...posts];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return post;
}

// 【削除】指定された投稿をメモ帳から消去する関数
export function deletePost(id: string): Post[] {
  if (typeof window === "undefined") return [];
  
  const posts = getPosts();
  // 指定されたID「以外」の投稿だけを残す（＝指定されたIDを消す）フィルター処理です
  const updatedPosts = posts.filter((post) => post.id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return updatedPosts;
}

/* ━━━━━━━ プロフィールの処理 ━━━━━━━ */

// 【プロフィール取得】メモ帳からプロフィールを読み込む関数
export function getProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  
  const data = localStorage.getItem(PROFILE_KEY);
  if (!data) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  return JSON.parse(data);
}

// 【プロフィール保存】プロフィールを新しく上書き保存する関数
export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
