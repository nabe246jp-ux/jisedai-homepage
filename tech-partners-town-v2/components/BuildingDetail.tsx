"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { buildingInfos, type Card } from "@/lib/buildingDetails";

/**
 * 建物クリック時に開く HTML オーバーレイ。
 * - 上部に建物名 + 説明 + 戻るボタン
 * - 中央にカードグリッド（カードクリックでさらに詳細）
 * - 詳細表示中は3列の sections を展開
 * - ESC は CameraRig 側で受けている
 */
export default function BuildingDetail() {
  const selected = useStore((s) => s.selectedBuilding);
  const setSelected = useStore((s) => s.setSelectedBuilding);
  const selectedCard = useStore((s) => s.selectedCard);
  const setSelectedCard = useStore((s) => s.setSelectedCard);

  // ESC でカード→建物詳細→街、と段階的に閉じる
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedCard) {
          e.stopPropagation();
          setSelectedCard(null);
        }
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [selected, selectedCard, setSelectedCard]);

  if (!selected) return null;

  const info = buildingInfos[selected];
  const card = selectedCard
    ? info.cards.find((c) => c.key === selectedCard) ?? null
    : null;

  return (
    <div
      className="bd-overlay"
      style={
        {
          // 建物の色味で全体の雰囲気を変える
          ["--bd-hue" as string]: info.hue,
        } as React.CSSProperties
      }
    >
      {/* 上部 */}
      <div className="bd-top glass-panel">
        <div className="bd-breadcrumb">
          <button
            className="bd-back"
            onClick={() => setSelected(null)}
            title="街に戻る (ESC)"
          >
            <span className="bd-back-arrow">‹</span>
            <span>街に戻る</span>
          </button>
          <span className="bd-bread-sep">›</span>
          <span className="bd-bread-here">{info.title}</span>
          {card && (
            <>
              <span className="bd-bread-sep">›</span>
              <span className="bd-bread-here bd-bread-card">{card.title}</span>
            </>
          )}
        </div>
        <div className="bd-titleblock">
          <div className="bd-eyebrow">{info.subtitle}</div>
          <h2 className="bd-title">{info.title}</h2>
          <p className="bd-desc">{info.description}</p>
        </div>
      </div>

      {/* 中央：カード or カード詳細 */}
      <div className="bd-body">
        {!card ? (
          <CardGrid
            cards={info.cards}
            onPick={(k) => setSelectedCard(k)}
          />
        ) : (
          <CardDetail card={card} onBack={() => setSelectedCard(null)} />
        )}
      </div>

      {/* 下部のヒント */}
      <div className="bd-hint">
        {!card
          ? "カードをクリック でさらに展開 ・ ESC や 戻るボタン で街へ"
          : "閉じるボタン で他のカード一覧へ ・ もう一度 ESC で街へ"}
      </div>
    </div>
  );
}

function CardGrid({
  cards,
  onPick,
}: {
  cards: Card[];
  onPick: (k: string) => void;
}) {
  return (
    <div className="bd-grid">
      {cards.map((c, i) => (
        <button
          key={c.key}
          className="bd-card"
          style={
            {
              ["--card-accent" as string]: c.accent,
              animationDelay: `${i * 60}ms`,
            } as React.CSSProperties
          }
          onClick={() => onPick(c.key)}
        >
          <div className="bd-card-tag">{c.tag}</div>
          <div className="bd-card-title">{c.title}</div>
          <div className="bd-card-sub">{c.subtitle}</div>
          <div className="bd-card-bullet">{c.bullet}</div>
          <div className="bd-card-more">詳しく見る ›</div>
        </button>
      ))}
    </div>
  );
}

function CardDetail({ card, onBack }: { card: Card; onBack: () => void }) {
  return (
    <div className="bd-detail">
      <div className="bd-detail-head">
        <div>
          <div className="bd-detail-tag" style={{ background: card.accent }}>
            {card.tag}
          </div>
          <h3 className="bd-detail-title">{card.title}</h3>
          <div className="bd-detail-sub">{card.subtitle}</div>
        </div>
        <button className="bd-close" onClick={onBack} title="閉じる">
          ×
        </button>
      </div>

      <div className="bd-detail-bullet">{card.bullet}</div>

      <div className="bd-detail-cols">
        {card.sections.map((s, i) => (
          <div className="bd-detail-col" key={i}>
            <div
              className="bd-detail-col-head"
              style={{ borderColor: card.accent }}
            >
              {s.heading}
            </div>
            <ul className="bd-detail-col-list">
              {s.lines.map((line, j) => (
                <li key={j}>
                  <span className="bd-bullet-dot" style={{ background: card.accent }} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
