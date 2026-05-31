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

// メモ帳の引き出しに貼るラベルの名前です
const STORAGE_KEY = "gummy_reviews_posts";

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
    author: "ハード派のタクミ",
    gummyName: "タフグミ コーラ味",
    text: "あごが鍛えられるくらいのかなりのハード系！噛みごたえ抜群で、すっきりした炭酸フレーバー。勉強中に集中したい時の相棒です。リピ確定！🔥",
    stars: 4,
    hardness: "超ハード",
    createdAt: "2026/05/31 11:30",
  },
];

// 【読み込み】メモ帳からすべての投稿を読み出す関数（命令）です
export function getPosts(): Post[] {
  // サーバー側ではなく、ブラウザで動いているときだけ実行します
  if (typeof window === "undefined") return INITIAL_POSTS;

  const data = localStorage.getItem(STORAGE_KEY);
  
  if (!data) {
    // もしまだ一度もメモ帳に何も書いていなければ、最初のサンプルデータを保存しておきます
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  
  // 保存されているテキストデータを、プログラムが読める形に変換して返します
  return JSON.parse(data);
}

// 【保存】新しい投稿をメモ帳に新しく書き加える関数（命令）です
export function savePost(newPost: Omit<Post, "id" | "createdAt">): Post {
  const posts = getPosts();
  
  // 今の日時を取得します
  const now = new Date();
  const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // 新しい投稿のデータを作ります（IDと時間を自動で割り振ります）
  const post: Post = {
    ...newPost,
    id: Date.now().toString(), // 重複しない適当な数字をIDにします
    createdAt: formattedDate,
  };

  // 新しい投稿が一番上にくるように、リストの先頭に追加します
  const updatedPosts = [post, ...posts];
  
  // メモ帳（localStorage）にテキストとして保存します
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return post;
}
