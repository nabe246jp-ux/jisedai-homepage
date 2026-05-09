"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getTimePalette } from "@/lib/timeOfDay";

/**
 * 街の外周に並ぶ装飾用タウンハウス群。クリック不可。
 * 欧州風で 高さ・色・屋根色 がバラバラ、窓は時間帯で発光。
 */
export default function BackgroundBuildings() {
  const buildings = useMemo(() => {
    const arr: BgDef[] = [];
    const palette = [
      { wall: "#e6cfa4", roof: "#a64a3a", accent: "#d4a574" }, // クリーム + 赤屋根
      { wall: "#d8a878", roof: "#7a4030", accent: "#e8c898" }, // テラコッタ
      { wall: "#a4b8c4", roof: "#3a4a5a", accent: "#cfd8e2" }, // 青灰
      { wall: "#cfa890", roof: "#5a3020", accent: "#e8c8a8" }, // ライトブラウン
      { wall: "#bcd4a8", roof: "#4a6a3a", accent: "#d8e8c8" }, // セージグリーン
      { wall: "#dcc4a4", roof: "#7a5a3a", accent: "#e8d4b4" }, // ウォームベージュ
      { wall: "#b8a4c8", roof: "#4a3a5a", accent: "#d4c4e0" }, // ラベンダー
      { wall: "#e8c8a4", roof: "#7a3a30", accent: "#f4d8b4" }, // ピーチ
    ];

    // 環状にずらりと並べる（プラザを取り囲む）
    const ringRadius = 24;
    const count = 28;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      // 4方向の道がある所は除外（道幅3.5位）
      const onRoad =
        Math.abs(Math.cos(a)) > 0.95 ||
        Math.abs(Math.sin(a)) > 0.95 ||
        (Math.abs(Math.cos(a)) > 0.7 && Math.abs(Math.sin(a)) > 0.7 && false);
      if (onRoad) continue;
      const r = ringRadius + (Math.random() - 0.5) * 1.5;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const w = 2.6 + Math.random() * 1.6;
      const h = 2.8 + Math.random() * 2.6;
      const d = 2.4 + Math.random() * 1.4;
      // 街の外側を向く
      const rotY = Math.atan2(z, x) + Math.PI / 2;
      const p = palette[Math.floor(Math.random() * palette.length)];
      arr.push({
        position: [x, 0, z],
        size: [w, h, d],
        rotY,
        wall: p.wall,
        roof: p.roof,
        accent: p.accent,
        roofType: Math.random() > 0.5 ? "gable" : "flat",
        seed: Math.random(),
      });
    }
    // さらに外側に2列目（背景感）
    const ringRadius2 = 32;
    const count2 = 32;
    for (let i = 0; i < count2; i++) {
      const a = (i / count2) * Math.PI * 2 + 0.05;
      const r = ringRadius2 + (Math.random() - 0.5) * 2.0;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const w = 3.0 + Math.random() * 2.0;
      const h = 3.5 + Math.random() * 3.0;
      const d = 2.6 + Math.random() * 1.6;
      const rotY = Math.atan2(z, x) + Math.PI / 2;
      const p = palette[Math.floor(Math.random() * palette.length)];
      arr.push({
        position: [x, 0, z],
        size: [w, h, d],
        rotY,
        wall: p.wall,
        roof: p.roof,
        accent: p.accent,
        roofType: Math.random() > 0.5 ? "gable" : "flat",
        seed: Math.random(),
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <BgBuilding key={i} {...b} />
      ))}
    </group>
  );
}

type BgDef = {
  position: [number, number, number];
  size: [number, number, number];
  rotY: number;
  wall: string;
  roof: string;
  accent: string;
  roofType: "gable" | "flat";
  seed: number;
};

function BgBuilding({ position, size, rotY, wall, roof, accent, roofType, seed }: BgDef) {
  const winMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  const windowMap = useMemo(() => makeWindowMap(seed, accent), [seed, accent]);

  useFrame(() => {
    if (!winMatRef.current) return;
    const tp = getTimePalette(virtualDate ?? new Date());
    const target = 0.15 + tp.lampIntensity * 1.4;
    winMatRef.current.emissiveIntensity +=
      (target - winMatRef.current.emissiveIntensity) * 0.04;
  });

  const [w, h, d] = size;

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* 本体 */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={wall} roughness={0.75} metalness={0.05} />
      </mesh>

      {/* 窓 */}
      <mesh position={[0, h / 2, d / 2 + 0.001]}>
        <planeGeometry args={[w * 0.85, h * 0.78]} />
        <meshStandardMaterial
          ref={winMatRef}
          map={windowMap}
          emissiveMap={windowMap}
          emissive={new THREE.Color(accent)}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.2}
          color="#3a3030"
        />
      </mesh>
      <mesh position={[0, h / 2, -d / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w * 0.85, h * 0.78]} />
        <meshStandardMaterial
          map={windowMap}
          emissiveMap={windowMap}
          emissive={new THREE.Color(accent)}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.2}
          color="#3a3030"
        />
      </mesh>

      {/* 屋根 */}
      {roofType === "gable" ? (
        <>
          {/* 切妻屋根（三角プリズム風） */}
          <mesh position={[0, h + 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, w + 0.2, 3, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={roof} roughness={0.6} metalness={0.2} />
          </mesh>
        </>
      ) : (
        <>
          {/* フラット屋根 + 縁 */}
          <mesh position={[0, h + 0.1, 0]} castShadow>
            <boxGeometry args={[w + 0.12, 0.2, d + 0.12]} />
            <meshStandardMaterial color={roof} roughness={0.6} metalness={0.2} />
          </mesh>
          {/* 煙突 */}
          {seed > 0.5 && (
            <mesh position={[w * 0.25, h + 0.6, d * 0.2]} castShadow>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color="#5a4030" roughness={0.7} />
            </mesh>
          )}
        </>
      )}

      {/* 1階のアクセント帯（モール） */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[w + 0.06, 0.12, d + 0.06]} />
        <meshStandardMaterial color={accent} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* ドア */}
      <mesh position={[0, 0.5, d / 2 + 0.002]}>
        <planeGeometry args={[0.5, 0.85]} />
        <meshStandardMaterial color="#3a2418" roughness={0.6} />
      </mesh>
      {/* ドアの上の小窓 */}
      <mesh position={[0, 1.0, d / 2 + 0.003]}>
        <planeGeometry args={[0.4, 0.12]} />
        <meshStandardMaterial
          color="#fff8e0"
          emissive="#f5cf8a"
          emissiveIntensity={0.15}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function makeWindowMap(seed: number, accent: string): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = 256;
  cnv.height = 384;
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "#3a3030";
  ctx.fillRect(0, 0, 256, 384);

  const cols = 4;
  const rows = Math.max(2, Math.floor(3 + seed * 4));
  const pad = 12;
  const cellW = (256 - pad * (cols + 1)) / cols;
  const cellH = (384 - pad * (rows + 1)) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * (cellW + pad);
      const y = pad + r * (cellH + pad);
      const on = Math.random() > 0.4;
      if (on) {
        const grd = ctx.createLinearGradient(x, y, x, y + cellH);
        grd.addColorStop(0, "#fff4d0");
        grd.addColorStop(1, accent);
        ctx.fillStyle = grd;
      } else {
        ctx.fillStyle = "#1a1410";
      }
      ctx.fillRect(x, y, cellW, cellH);
      // 窓枠
      ctx.strokeStyle = "rgba(40,30,20,0.7)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellW, cellH);
      // 中央の十字
      ctx.beginPath();
      ctx.moveTo(x + cellW / 2, y);
      ctx.lineTo(x + cellW / 2, y + cellH);
      ctx.moveTo(x, y + cellH / 2);
      ctx.lineTo(x + cellW, y + cellH / 2);
      ctx.stroke();
      // シャッター（下半分にだけ薄く）
      if (Math.random() > 0.5) {
        ctx.fillStyle = "rgba(120,80,40,0.25)";
        ctx.fillRect(x, y + cellH * 0.7, cellW, cellH * 0.3);
      }
    }
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
