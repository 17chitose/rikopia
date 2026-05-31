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

// 🆕 12通りのマトリックス辞書データ（果汁グミ弾力プラスから、ハリボーゴールドベアに修正！）
const RECOMMENDATIONS: Record<string, GummyRecommendation> = {
  // ━━━ 🧸 やわらかめ ━━━
  "やわらかめ-フルーツ-あり": {
    name: "ピュレグミ プレミアム ピーチ",
    desc: "とろっとろの贅沢なフルーツジュレが中からじゅわ〜っと溢れ出る！すっぱいパウダーと、とろける甘さのコントラストが極上のご褒美グミです🍑",
    emoji: "🍑"
  },
  "яわらかめ-フルーツ-なし": {
    name: "コロロ ぶどう味",
    desc: "まるで本物のぶどうの果実をかじっているかのようなジューシーさ！皮がプチッと弾ける、パウダーなし新食感グミです🍇",
    emoji: "🍇"
  },
  "やわらかめ-炭酸ソーダ-あり": {
    name: "ブルボン しゃりもにグミ ソーダ味",
    desc: "「しゃりっ」としたすっぱいヨーグルト風味パウダーと、中の「もにっ」とした超やわらか食感がクセになる！爽やかなソーダの味わいと新食感がたまらない絶品グミです🥤",
    emoji: "🥤"
  },
  "やわらかめ-炭酸ソーダ-なし": {
    name: "コグミ ソーダアソート",
    desc: "ちっちゃくてぷにぷにの超可愛い小粒グミ！パウダーなしなので、ソーダ、メロンソーダ、グレープソーダなど、いろんな爽やかドリンク味をポイポイ優しく楽しめます🍬",
    emoji: "🍬"
  },

  // ━━━ 😋 ふつう ━━━
  "ふつう-フルーツ-あり": {
    name: "ピュレグミ レモン味",
    desc: "周りにまぶされたすっぱいパウダーと、あとから広がる果肉のジューシーな甘酸っぱさが絶妙！もっちりした噛みごたえとハートの形がたまらなく可愛い大人気グミ🍋",
    emoji: "🍋"
  },
  "ふつう-フルーツ-なし": {
    name: "果汁グミ ぶどう",
    desc: "日本のグミの超王道！くだもの本来のジューシーな甘みと、絶妙に心地よい弾力で、子供から大人まで誰にでも愛されるパウダーなしの絶対的エースです👑🍇",
    emoji: "🍇"
  },
  "ふつう-炭酸ソーダ-あり": {
    name: "フィットチーネグミ ソーダ味",
    desc: "イタリアンパスタのような平打ちシートの「アルデンテ」な弾む噛みごたえ！きゅんとすっぱいソーダパウダーが最高にリフレッシュさせてくれます🥤",
    emoji: "🥤"
  },
  "ふつう-炭酸ソーダ-なし": {
    name: "ポイフル ソーダ",
    desc: "周りの薄い糖衣のサクッとした食感と、中のぷにっと感が最高！パウダーなしで甘く爽やか、カラフルでポップに楽しめる定番のラムネソーダグミです🍬",
    emoji: "🍬"
  },

  // ━━━ 🦖 かため・ハード ━━━
  "かため-フルーツ-あり": {
    name: "ノーベル シン・サワーズグミ グレープ味",
    desc: "「シン・サワパウダー」をまとった、すっぱさ限界突破のハードグミ！平たいカメの甲羅の形をしていて、すっきりジューシーなグレープ味と強烈なすっぱさが刺激的です⚡🍇",
    emoji: "⚡"
  },
  // 🆕 変更：果汁グミ弾力プラスから、ハードグミの王様「ハリボー ゴールドベア」にアップデート！
  "かため-フルーツ-なし": {
    name: "ハリボー ゴールドベア",
    desc: "世界中で愛されるハードグミのパイオニア！カラフルで可愛いクマの形をしていて、パウダーなしで噛めれば噛むほどフルーティーな美味しさが広がる、しっかりとした硬さが大人気の超定番グミです🧸",
    emoji: "🧸"
  },
  "かため-炭酸ソーダ-あり": {
    name: "タフグミ コーラ＆ソーダ",
    desc: "大容量でガツンと硬い！大きなキューブ型で非常に強い弾力があり、高炭酸のすっぱいサワーパウダーが超刺激的。勉強やゲーム中に集中したい時の最高の相棒です🔥",
    emoji: "🔥"
  },
  "かため-炭酸ソーダ-なし": {
    name: "明治 コーラアップ",
    desc: "あごが鍛えられるほどの超極硬ハード食感！パウダーなしで、みんなが大好きなコーラの深いコクと心地よい甘みを一粒ずつじっくりと噛みしめる王道ハードグミです🥤",
    emoji: "🥤"
  }
};

export default function RecommendPage() {
  // 現在の画面の状態（0: スタート, 1〜3: 質問, 4: 結果発表）
  const [step, setStep] = useState(0);

  // 選んだ回答を覚えておく state
  const [hardness, setHardness] = useState(""); // かたさ (やわらかめ / ふつう / かため)
  const [flavor, setFlavor] = useState("");     // 味 (フルーツ / 炭酸ソーダ)
  const [powder, setPowder] = useState("");     // パウダー (あり / なし)

  const [result, setResult] = useState<GummyRecommendation | null>(null);

  // 診断を最初からスタートする時
  const handleStart = () => {
    setHardness("");
    setFlavor("");
    setPowder("");
    setResult(null);
    setStep(1);
  };

  // 質問1：かたさを選択した時
  const handleSelectHardness = (ans: string) => {
    setHardness(ans);
    setStep(2);
  };

  // 質問2：味を選択した時
  const handleSelectFlavor = (ans: string) => {
    setFlavor(ans);
    setStep(3);
  };

  // 質問3：パウダーを選択した時（ここで最終判定を行います！）
  const handleSelectPowder = (ans: string) => {
    setPowder(ans);
    
    // 3つの回答を結合してキーを作ります
    const key = `${hardness}-${flavor}-${ans}`;
    
    // 辞書から該当するグミを引き出します
    const recommended = RECOMMENDATIONS[key] || RECOMMENDATIONS["ふつう-フルーツ-なし"];
    
    setResult(recommended);
    setStep(4);
  };

  return (
    <main>
      {/* 診断ページのヘッダー */}
      <div className="header-container">
        <h1 className="title">🎯 グミコンシェルジュ</h1>
        <p className="subtitle">3つの質問に答えるだけで、あなたにピッタリのグミを正確に診断します！</p>
      </div>

      {/* ━━━ スタート画面 ━━━ */}
      {step === 0 && (
        <div className="quiz-card">
          <span style={{ fontSize: "4rem", display: "block", marginBottom: "16px" }}>🔮</span>
          <h2 className="quiz-question" style={{ marginBottom: "12px" }}>あなたにぴったりのグミはどれ？</h2>
          <p style={{ color: "var(--text-light)", fontSize: "0.9rem", marginBottom: "24px", lineHeight: "1.6" }}>
            「かたさ」「味」「パウダー」の好みに答えるだけで、<br />
            12種類のグミの中から、あなたに最もベストなグミを1つご提案します！
          </p>
          <button onClick={handleStart} className="submit-btn">
            診断をスタートする 🚀
          </button>
        </div>
      )}

      {/* ━━━ 質問1（食感） ━━━ */}
      {step === 1 && (
        <div className="quiz-card">
          <span className="quiz-progress">質問 1 / 3</span>
          <h2 className="quiz-question">好みのグミの「食感（かたさ）」は？</h2>
          <div className="quiz-options">
            <button onClick={() => handleSelectHardness("やわらかめ")} className="quiz-opt-btn">
              🧸 やわらかめ (ジュレ系や、もにもに系)
            </button>
            <button onClick={() => handleSelectHardness("ふつう")} className="quiz-opt-btn">
              😋 ふつう (王道の食感、心地よい弾力)
            </button>
            <button onClick={() => handleSelectHardness("かため")} className="quiz-opt-btn">
              🦖 かため・ハード (あごが鍛えられる噛みごたえ)
            </button>
          </div>
        </div>
      )}

      {/* ━━━ 質問2（味） ━━━ */}
      {step === 2 && (
        <div className="quiz-card">
          <span className="quiz-progress">質問 2 / 3</span>
          <h2 className="quiz-question">どんな「味（フレーバー）」が好き？</h2>
          <div className="quiz-options">
            <button onClick={() => handleSelectFlavor("フルーツ")} className="quiz-opt-btn">
              🍎 フルーツ系 (ジューシーな果汁感)
            </button>
            <button onClick={() => handleSelectFlavor("炭酸ソーダ")} className="quiz-opt-btn">
              🥤 炭酸ソーダ系 (シュワッと爽やかドリンク風味)
            </button>
          </div>
        </div>
      )}

      {/* ━━━ 質問3（パウダーの有無） ━━━ */}
      {step === 3 && (
        <div className="quiz-card">
          <span className="quiz-progress">質問 3 / 3</span>
          <h2 className="quiz-question">周りの「すっぱいパウダー」は欲しい？</h2>
          <div className="quiz-options">
            <button onClick={() => handleSelectPowder("あり")} className="quiz-opt-btn">
              ⚡ すっぱいパウダーがたっぷり欲しい！
            </button>
            <button onClick={() => handleSelectPowder("なし")} className="quiz-opt-btn">
              🍭 パウダーは不要！甘く優しく食べたい
            </button>
          </div>
        </div>
      )}

      {/* ━━━ 診断結果画面 ━━━ */}
      {step === 4 && result && (
        <div>
          <div className="result-card">
            <span className="result-badge">あなたへのおすすめはこれ！</span>
            <span style={{ fontSize: "3.5rem", display: "block", margin: "8px 0" }}>{result.emoji}</span>
            <h2 className="result-gummy">{result.name}</h2>
            <div className="result-desc">{result.desc}</div>

            {/* パラメータに診断結果のグミ名をのせて、レビュー投稿画面へジャンプ */}
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
