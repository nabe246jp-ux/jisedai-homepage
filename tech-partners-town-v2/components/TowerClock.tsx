"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";

/**
 * 中央奥のドーム塔の正面に取り付けるデジタル時計盤。
 *  - 黒い盤面に金の枠
 *  - HH:MM:SS が金色で発光
 *  - 仮想時計（virtualDate）に連動
 *  - 200ms ごとに描画更新
 */
export default function TowerClock({
  position = [0, 5.6, -20.2],
  width = 3.4,
  height = 1.4,
}: {
  position?: [number, number, number];
  width?: number;
  height?: number;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const lastDrawn = useRef("");
  const virtualDate = useStore((s) => s.virtualDate);

  // 動的に書き換える Canvas + Texture
  const { canvas, ctx, texture } = useMemo(() => {
    const cnv = document.createElement("canvas");
    cnv.width = 1024;
    cnv.height = 384;
    const ctx2 = cnv.getContext("2d")!;
    const tex = new THREE.CanvasTexture(cnv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { canvas: cnv, ctx: ctx2, texture: tex };
  }, []);

  useFrame(() => {
    const now = virtualDate ?? new Date();
    const HH = String(now.getHours()).padStart(2, "0");
    const MM = String(now.getMinutes()).padStart(2, "0");
    const SS = String(now.getSeconds()).padStart(2, "0");
    const text = `${HH}:${MM}:${SS}`;
    if (text === lastDrawn.current) return;
    drawClock(ctx, canvas.width, canvas.height, text);
    texture.needsUpdate = true;
    lastDrawn.current = text;
  });

  return (
    <group position={position}>
      {/* 黒い盤面のベース（壁から少し奥まる窪みを表現するため二重） */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[width + 0.4, height + 0.4]} />
        <meshStandardMaterial color="#1a1410" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* 金の額縁 */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width + 0.18, height + 0.18]} />
        <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.2} />
      </mesh>
      {/* デジタル盤面本体 */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={matRef} map={texture} toneMapped={false} />
      </mesh>
      {/* 周辺を ぼうっと光らせる ライト（夜に映える） */}
      <pointLight position={[0, 0, 0.5]} color="#f5cf8a" intensity={0.6} distance={6} decay={2} />
    </group>
  );
}

function drawClock(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string
) {
  // 黒い背景
  ctx.fillStyle = "#08070a";
  ctx.fillRect(0, 0, w, h);

  // 上下に薄い金の細線
  ctx.fillStyle = "rgba(212, 165, 116, 0.55)";
  ctx.fillRect(20, 18, w - 40, 3);
  ctx.fillRect(20, h - 21, w - 40, 3);

  // TOWN TIME ラベル
  ctx.fillStyle = "rgba(212, 165, 116, 0.85)";
  ctx.font = "600 38px 'Cinzel', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("TOWN TIME", w / 2, 60);

  // メインの大きな時刻
  ctx.shadowColor = "rgba(245, 207, 138, 0.95)";
  ctx.shadowBlur = 28;
  ctx.fillStyle = "#ffe9b8";
  ctx.font = "700 200px 'Cinzel', monospace";
  ctx.fillText(text, w / 2, h / 2 + 30);
  ctx.shadowBlur = 0;
}
