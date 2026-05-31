// app/recommend/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

// 診断結果となるおすすめグミのデータ構造です
type GummyRecommendation = {
  name: string;
  desc: string;
  emoji: string;
};

// 診断の組み合わせに合わせたおすすめグミの辞書データです（全9パターン）
const RECOMMENDATIONS: Record<string, GummyRecommendation> = {
  "やわらかめ-フルーツ": {
    name: "コロロ ぶどう味",
    desc: "まるで本物のぶどうの果実をかじっているかのようなジューシーで新食感なグミ！皮がプチッと弾けるような驚きを体験してみて🍇",
    emoji: "🍇"
  },
  "やわらかめ-炭酸ソーダ": {
    name: "ぷっちょグミ ソーダ味",
    desc: "ぷにぷにのちっちゃい可愛いグミの中に、しゅわしゅわのヨーグルトボールが入った楽しい食感！お口の中でポポイと弾けます🥤",
    emoji: "🥤"
  },
  "やわらかめ-すっぱい系": {
    name: "ピュレグミ プレミアム ピーチ",
    desc: "とろっとろの贅沢なピーレジュレが中からじゅわ〜っと溢れ出る、頑張った日のご褒美にぴったりの大人フルーティーグミ🍑",
    emoji: "🍑"
  },
  "ふつう-フルーツ": {
    name: "果汁グミ ぶどう",
    desc: "日本のグミの超王道！くだもの本来のジューシーな甘みと、絶妙に心地よい噛みごたえで、子供から大人まで誰にでも愛される絶対的エースです👑🍇",
    emoji: "🍇"
  },
  "ふつう-炭酸ソーダ": {
    name: "ポイフル ソーダ",
    desc: "周りの薄い糖衣のサクッとした食感と、中のぷにっと感が最高！カラフルで見た目もポップでハッピーになれる定番のラムネソーダグミですソーダ風味🍬",
    emoji: "🍬"
  },
  "ふつう-すっぱい系": {
    name: "ピュレグミ レモン味",
    desc: "周りにまぶされたすっぱいパウダーと、あとから広がる果肉のジューシーな甘酸っぱさが絶妙！ハートの形がたまらなく可愛い大人気グミ🍋",
    emoji: "🍋"
  },
  "かため-フルーツ": {
    name: "果汁グミ 弾力プラス ぶどう",
    desc: "王道のジューシーな美味しさはそのままに、ガシガシと強く噛めるハードな弾力をプラス！しっかりとした満足感がほしい時におすすめの一品です🍇",
    emoji: "💪"
  },
  "かため-炭酸ソーダ": {
    name: "タフグミ コーラ＆ソーダ",
    desc: "大容量でガツンと硬い！大きなキューブ型で非常に強い弾力があり、高炭酸の酸っぱさが刺激的。勉強やゲーム中に集中力を高めたい時の最強の相棒です🔥",
    emoji: "🔥"
  },
  "かため-すっぱい系": {
    name: "シゲキックス レモン味",
    desc: "あごが痛くなるほどの超極小＆超極硬ハード食感！そして、一口噛んだ瞬間に涙が出るほど超絶に酸っぱいパウダーがあなたの脳をダイレクトに刺激します⚡🍋",
    emoji: "⚡"
  }
};

export default function RecommendPage() {
  // 現在の画面の状態（0: スタート, 1: 質問1, 2: 質問2, 3: 結果発表）
  const [step, setStep] = useState(0);

  // 選んだ回答を覚えておく state
  const [hardness, setHardness] = useState("");
  const [taste, setTaste] = useState("");

  // 診断結果
  const [result, setResult] = useState<GummyRecommendation | null>(null);

  // スタートボタンを押した時
  const handleStart = () => {
    setHardness("");
    setTaste("");
    setResult(null);
    setStep(1);
  };

  // 質問1（かたさ）を選択した時
  const handleSelectHardness = (ans: string) => {
    setHardness(ans);
    setStep(2);
  };

  // 質問2（味）を選択した時（これで診断結果を出します）
  const handleSelectTaste = (ans: string) => {
    setTaste(ans);
    
    // 組み合わせのキー（例: "やわらかめ-フルーツ"）を作ります
    const key = `${hardness}-${ans}`;
    const recommended = RECOMMENDATIONS[key] || RECOMMENDATIONS["ふつう-フルーツ"];
    
    setResult(recommended);
    setStep(3);
  };

  return (
    <main>
      {/* 診断ページのヘッダー */}
      <div className="header-container">
        <h1 className="title">🎯 グミコンシェルジュ</h1>
        <p className="subtitle">簡単な質問に答えるだけで、あなたにピッタリのグミを紹介します！</p>
      </div>

      {/* ━━━ スタート画面 ━━━ */}
      {step === 0 && (
        <div className="quiz-card">
          <span style={{ fontSize: "4rem", display: "block", marginBottom: "16px" }}>🔮</span>
          <h2 className="quiz-question" style={{ marginBottom: "12px" }}>あなたにぴったりのグミはどれ？</h2>
          <p style={{ color: "var(--text-light)", fontSize: "0.9rem", marginBottom: "24px", lineHeight: "1.6" }}>
            「かたさ」や「味」の好みに答えるだけで、<br />
            おすすめのグミを1つだけ選んで提案します！
          </p>
          <button onClick={handleStart} className="submit-btn">
            診断をスタートする 🚀
          </button>
        </div>
      )}

      {/* ━━━ 質問1（食感） ━━━ */}
      {step === 1 && (
        <div className="quiz-card">
          <span className="quiz-progress">質問 1 / 2</span>
          <h2 className="quiz-question">好みのグミの「食感（かたさ）」は？</h2>
          <div className="quiz-options">
            <button onClick={() => handleSelectHardness("やわらかめ")} className="quiz-opt-btn">
              🧸 やわらかめ (ジュレ系や、ぷにぷに系)
            </button>
            <button onClick={() => handleSelectHardness("ふつう")} className="quiz-opt-btn">
              😋 ふつう (王道の食感、グミらしい弾力)
            </button>
            <button onClick={() => handleSelectHardness("かため")} className="quiz-opt-btn">
              🦖 かため・ハード (ガシガシ噛める噛みごたえ)
            </button>
          </div>
        </div>
      )}

      {/* ━━━ 質問2（味） ━━━ */}
      {step === 2 && (
        <div className="quiz-card">
          <span className="quiz-progress">質問 2 / 2</span>
          <h2 className="quiz-question">どんな「味（フレーバー）」が好き？</h2>
          <div className="quiz-options">
            <button onClick={() => handleSelectTaste("フルーツ")} className="quiz-opt-btn">
              🍎 フルーツ系 (ジューシーな果汁感)
            </button>
            <button onClick={() => handleSelectTaste("炭酸ソーダ")} className="quiz-opt-btn">
              🥤 炭酸・ソーダ系 (シュワッと爽やかドリンク風味)
            </button>
            <button onClick={() => handleSelectTaste("すっぱい系")} className="quiz-opt-btn">
              ⚡ すっぱい系 (パウダー付きや、強烈な酸味)
            </button>
          </div>
        </div>
      )}

      {/* ━━━ 診断結果画面 ━━━ */}
      {step === 3 && result && (
        <div>
          <div className="result-card">
            <span className="result-badge">あなたへのおすすめはこれ！</span>
            <span style={{ fontSize: "3.5rem", display: "block", margin: "8px 0" }}>{result.emoji}</span>
            <h2 className="result-gummy">{result.name}</h2>
            <div className="result-desc">{result.desc}</div>

            {/* 🆕 診断されたグミの名前をパラメータに載せて、レビュー投稿画面へジャンプします！ */}
            <Link 
              href={`/new?gummy=${encodeURIComponent(result.name)}`} 
              className="submit-btn" 
              style={{ display: "block", textDecoration: "none", marginBottom: "12px" }}
            >
              ✍️ このグミのレビューを書く
            </Link>

            <button 
              onClick={handleStart} 
              className="submit-btn" 
              style={{ background: "#4b5563" }}
            >
              🔄 もう一度診断する
            </button>
          </div>

          <Link href="/" className="back-link">
            ← タイムラインに戻る
          </Link>
        </div>
      )}
    </main>
  );
}
