"use client";

import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore, type BuildingKey } from "@/lib/store";
import { getTimePalette } from "@/lib/timeOfDay";

/**
 * 4つのトピック建物。ヨーロッパの旧市街風（南仏・トスカーナ・北欧）。
 *  - 暖色の漆喰壁
 *  - 4面に傾斜屋根（ピラミッド型）
 *  - 屋根に小さな天窓（ドーマー）
 *  - 煙突
 *  - 観音開きの鎧戸（シャッター）
 *  - 窓下のフラワーボックス
 *  - 入口扉とアーチ装飾
 */

type BuildingDef = {
  key: BuildingKey;
  position: [number, number, number];
  size: [number, number, number]; // 幅・高さ・奥行き
  wallColor: string;
  roofColor: string;
  shutterColor: string;
  flowerColor: string;
  label: string;
};

export default function Buildings() {
  const buildings: BuildingDef[] = useMemo(
    () => [
      {
        key: "training",
        position: [-7, 0, -5],
        size: [3.4, 4.5, 2.6],
        wallColor: "#f3e3c0",      // 漆喰クリーム
        roofColor: "#a14a3a",      // テラコッタ
        shutterColor: "#3a5a78",   // 紺の鎧戸
        flowerColor: "#d63a5a",    // 赤い花
        label: "研修",
      },
      {
        key: "business",
        position: [7, 0, -5],
        size: [3.0, 5.6, 3.0],
        wallColor: "#e0c890",      // 黄土・オークル
        roofColor: "#3a3a4a",      // 暗いスレート
        shutterColor: "#5a3a3a",   // 茶色の鎧戸
        flowerColor: "#f5b942",    // 黄色い花
        label: "事業",
      },
      {
        key: "welfare",
        position: [-7, 0, 5],
        size: [3.4, 3.8, 2.6],
        wallColor: "#d8e4c8",      // セージグリーンの漆喰
        roofColor: "#7a3a2a",      // 暗いテラコッタ
        shutterColor: "#3a4a3a",   // 深緑の鎧戸
        flowerColor: "#a878f5",    // 紫の花
        label: "福利厚生",
      },
      {
        key: "company",
        position: [7, 0, 5],
        size: [3.0, 4.2, 2.8],
        wallColor: "#ead5dc",      // ピンクがかったベージュ
        roofColor: "#3a3a4a",      // 暗いスレート
        shutterColor: "#4a3a55",   // 紫紺の鎧戸
        flowerColor: "#5fb87a",    // 緑の花
        label: "会社概要",
      },
    ],
    []
  );

  return (
    <group>
      {buildings.map((b, i) => (
        <Building
          key={b.key}
          bkey={b.key}
          position={b.position}
          size={b.size}
          wallColor={b.wallColor}
          roofColor={b.roofColor}
          shutterColor={b.shutterColor}
          flowerColor={b.flowerColor}
          label={b.label}
          index={i}
        />
      ))}
    </group>
  );
}

type BuildingProps = {
  bkey: BuildingKey;
  position: [number, number, number];
  size: [number, number, number];
  wallColor: string;
  roofColor: string;
  shutterColor: string;
  flowerColor: string;
  label: string;
  index: number;
};

function Building({
  bkey,
  position,
  size,
  wallColor,
  roofColor,
  shutterColor,
  flowerColor,
  label,
  index,
}: BuildingProps) {
  const buildingKey = bkey;
  const groupRef = useRef<THREE.Group>(null!);
  const winMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const beaconRef = useRef<THREE.PointLight>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);

  const virtualDate = useStore((s) => s.virtualDate);
  const lastKpiUpdate = useStore((s) => s.lastKpiUpdate);
  const selectedBuilding = useStore((s) => s.selectedBuilding);
  const hoveredBuilding = useStore((s) => s.hoveredBuilding);
  const setSelectedBuilding = useStore((s) => s.setSelectedBuilding);
  const setHoveredBuilding = useStore((s) => s.setHoveredBuilding);

  const [w, h, d] = size;

  // 階の数を建物の高さから決める
  const floors = Math.max(2, Math.floor(h / 1.4));
  // 屋根のピッチ高さ
  const roofH = Math.min(w, d) * 0.55;

  // 窓テクスチャ（窓ガラスとして使用）
  const windowMap = useMemo(() => makeWindowGlassTexture(), []);

  useFrame((state) => {
    const now = virtualDate ?? new Date();
    const tp = getTimePalette(now);
    const t = state.clock.getElapsedTime();
    const isHovered = hoveredBuilding === buildingKey;
    const isSelected = selectedBuilding === buildingKey;
    const focused = isHovered || isSelected;

    if (groupRef.current) {
      const baseY = Math.sin(t * 0.4 + index * 1.7) * 0.03;
      const targetY = baseY + (focused ? 0.15 : 0);
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.08;
    }
    if (winMatRef.current) {
      const baseTarget = 0.15 + tp.lampIntensity * 1.4;
      const focusBoost = focused ? 0.8 : 0;
      const target = baseTarget + focusBoost;
      winMatRef.current.emissiveIntensity +=
        (target - winMatRef.current.emissiveIntensity) * 0.06;

      const since = Date.now() - lastKpiUpdate;
      if (since < 1500 && lastKpiUpdate > 0) {
        const k = 1 - since / 1500;
        winMatRef.current.emissiveIntensity += k * 1.0 * (Math.sin(t * 18) * 0.5 + 0.8);
      }
    }
    if (beaconRef.current) {
      const target = focused ? 1.4 : 0;
      beaconRef.current.intensity += (target - beaconRef.current.intensity) * 0.12;
    }
    if (haloRef.current) {
      const targetOpacity = focused ? 0.55 : 0;
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
      haloRef.current.rotation.z = t * 0.6;
    }
  });

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredBuilding(buildingKey);
    document.body.style.cursor = "pointer";
  };
  const onPointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredBuilding(null);
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedBuilding(buildingKey);
  };

  // 1階あたりの高さ
  const floorH = h / floors;
  // 窓・鎧戸の配置
  const winCols = Math.max(2, Math.floor(w / 1.2));

  return (
    <group ref={groupRef} position={position}>
      {/* 足元のハロー */}
      <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[w * 0.7, w * 0.95, 48]} />
        <meshBasicMaterial color={shutterColor} transparent opacity={0} />
      </mesh>

      <group onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
        {/* 石の基壇 */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.4, 0.3, d + 0.4]} />
          <meshStandardMaterial color="#9c8a72" metalness={0.1} roughness={0.85} />
        </mesh>

        {/* 漆喰の壁 */}
        <mesh position={[0, h / 2 + 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={wallColor} metalness={0.0} roughness={0.85} />
        </mesh>

        {/* 階ごとの装飾線（壁の凹凸） */}
        {Array.from({ length: floors - 1 }).map((_, i) => {
          const y = 0.3 + (i + 1) * floorH;
          return (
            <mesh key={`band-${i}`} position={[0, y, 0]} castShadow>
              <boxGeometry args={[w + 0.06, 0.06, d + 0.06]} />
              <meshStandardMaterial color="#c9b88f" roughness={0.7} />
            </mesh>
          );
        })}

        {/* 窓と鎧戸（前面） */}
        {Array.from({ length: floors }).map((_, fi) => {
          // 1階だけ入口扉、それより上は窓
          if (fi === 0) {
            return (
              <Door
                key={`door-${fi}`}
                position={[0, 0.3 + 0.5, d / 2 + 0.001]}
                color={shutterColor}
                wallColor={wallColor}
              />
            );
          }
          return Array.from({ length: winCols }).map((_, ci) => {
            const x = -w / 2 + (w / (winCols + 1)) * (ci + 1);
            const y = 0.3 + fi * floorH + floorH * 0.5;
            return (
              <Window
                key={`win-f-${fi}-${ci}`}
                position={[x, y, d / 2 + 0.005]}
                shutterColor={shutterColor}
                flowerColor={flowerColor}
                glassMap={windowMap}
                glassMatRef={fi === 1 && ci === 0 ? winMatRef : undefined}
              />
            );
          });
        })}

        {/* 側面の窓（左） */}
        {Array.from({ length: floors }).map((_, fi) => {
          if (fi === 0) return null;
          return Array.from({ length: 1 }).map((_, ci) => (
            <Window
              key={`win-l-${fi}-${ci}`}
              position={[-w / 2 - 0.005, 0.3 + fi * floorH + floorH * 0.5, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              shutterColor={shutterColor}
              flowerColor={flowerColor}
              glassMap={windowMap}
            />
          ));
        })}

        {/* 側面の窓（右） */}
        {Array.from({ length: floors }).map((_, fi) => {
          if (fi === 0) return null;
          return Array.from({ length: 1 }).map((_, ci) => (
            <Window
              key={`win-r-${fi}-${ci}`}
              position={[w / 2 + 0.005, 0.3 + fi * floorH + floorH * 0.5, 0]}
              rotation={[0, Math.PI / 2, 0]}
              shutterColor={shutterColor}
              flowerColor={flowerColor}
              glassMap={windowMap}
            />
          ));
        })}

        {/* 軒（屋根の根本のせり出し） */}
        <mesh position={[0, h + 0.32, 0]} castShadow>
          <boxGeometry args={[w + 0.2, 0.12, d + 0.2]} />
          <meshStandardMaterial color="#c9b88f" roughness={0.7} />
        </mesh>

        {/* 屋根（ピラミッド型のヒップド・ルーフ） */}
        <mesh
          position={[0, h + 0.4 + roofH / 2, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <coneGeometry args={[Math.hypot((w + 0.2) / 2, (d + 0.2) / 2), roofH, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.6} metalness={0.05} flatShading />
        </mesh>

        {/* 煙突 */}
        <mesh position={[w * 0.3, h + 0.4 + roofH * 0.65, d * 0.2]} castShadow>
          <boxGeometry args={[0.28, 0.65, 0.28]} />
          <meshStandardMaterial color="#9c5a4a" roughness={0.8} />
        </mesh>
        <mesh position={[w * 0.3, h + 0.4 + roofH * 0.95, d * 0.2]} castShadow>
          <boxGeometry args={[0.34, 0.06, 0.34]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>

        {/* 屋根の天窓（ドーマー） */}
        <Dormer position={[0, h + 0.45, d / 2 + 0.05]} accent={shutterColor} />

        {/* 銘板（建物正面） */}
        <mesh position={[0, h + 0.25, d / 2 + 0.21]}>
          <planeGeometry args={[1.6, 0.36]} />
          <meshBasicMaterial map={makeLabelTexture(label)} transparent />
        </mesh>
      </group>

      <pointLight
        ref={beaconRef}
        position={[0, h + 1.4, 0]}
        color={shutterColor}
        intensity={0}
        distance={5}
        decay={2}
      />
    </group>
  );
}

/* ====== 窓 + 鎧戸 + フラワーボックス ====== */
function Window({
  position,
  rotation = [0, 0, 0],
  shutterColor,
  flowerColor,
  glassMap,
  glassMatRef,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  shutterColor: string;
  flowerColor: string;
  glassMap: THREE.CanvasTexture;
  glassMatRef?: React.MutableRefObject<THREE.MeshStandardMaterial | null>;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 窓枠（少し奥まる） */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.55, 0.7]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
      </mesh>
      {/* 窓ガラス */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[0.48, 0.62]} />
        <meshStandardMaterial
          ref={(m) => {
            if (glassMatRef && m) glassMatRef.current = m;
          }}
          map={glassMap}
          emissiveMap={glassMap}
          emissive="#fff5d8"
          emissiveIntensity={0.8}
          color="#1a2a3a"
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
      {/* 窓桟（縦・横） */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.04, 0.62]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.48, 0.04]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
      </mesh>
      {/* 鎧戸（左） */}
      <mesh position={[-0.36, 0, 0.025]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.22, 0.7, 0.025]} />
        <meshStandardMaterial color={shutterColor} roughness={0.7} />
      </mesh>
      {/* 鎧戸の横線 */}
      {[-0.2, 0, 0.2].map((y, i) => (
        <mesh key={`sl-${i}`} position={[-0.36, y, 0.04]} rotation={[0, 0.18, 0]}>
          <boxGeometry args={[0.22, 0.02, 0.005]} />
          <meshStandardMaterial color="#1a1820" roughness={0.6} />
        </mesh>
      ))}
      {/* 鎧戸（右） */}
      <mesh position={[0.36, 0, 0.025]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.22, 0.7, 0.025]} />
        <meshStandardMaterial color={shutterColor} roughness={0.7} />
      </mesh>
      {[-0.2, 0, 0.2].map((y, i) => (
        <mesh key={`sr-${i}`} position={[0.36, y, 0.04]} rotation={[0, -0.18, 0]}>
          <boxGeometry args={[0.22, 0.02, 0.005]} />
          <meshStandardMaterial color="#1a1820" roughness={0.6} />
        </mesh>
      ))}
      {/* フラワーボックス */}
      <mesh position={[0, -0.4, 0.06]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.85} />
      </mesh>
      {/* 花 */}
      {[-0.2, -0.05, 0.1, 0.22].map((x, i) => (
        <mesh key={`fl-${i}`} position={[x, -0.34, 0.08]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={flowerColor}
            emissive={flowerColor}
            emissiveIntensity={0.2}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ====== 入口扉 ====== */
function Door({
  position,
  color,
  wallColor,
}: {
  position: [number, number, number];
  color: string;
  wallColor: string;
}) {
  return (
    <group position={position}>
      {/* アーチの石枠 */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[1.0, 1.1]} />
        <meshStandardMaterial color="#c9b88f" roughness={0.7} />
      </mesh>
      {/* 扉本体 */}
      <mesh position={[0, -0.05, 0.015]}>
        <planeGeometry args={[0.8, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* 縦の桟 */}
      <mesh position={[0, -0.05, 0.025]}>
        <planeGeometry args={[0.04, 1.0]} />
        <meshStandardMaterial color="#1a1820" />
      </mesh>
      {/* ノブ */}
      <mesh position={[0.28, -0.1, 0.03]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#d4a574" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* 上のアーチ装飾 */}
      <mesh position={[0, 0.5, 0.02]}>
        <planeGeometry args={[1.05, 0.18]} />
        <meshStandardMaterial color="#9c8a72" roughness={0.7} />
      </mesh>
      {/* キーストーン（中央の楔石） */}
      <mesh position={[0, 0.55, 0.025]}>
        <planeGeometry args={[0.18, 0.24]} />
        <meshStandardMaterial color="#6a4a30" roughness={0.7} />
      </mesh>
      {/* 壁色を補う背景の薄板（不要色を避ける） */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[1.0, 1.1]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ====== 屋根の天窓 ====== */
function Dormer({
  position,
  accent,
}: {
  position: [number, number, number];
  accent: string;
}) {
  return (
    <group position={position}>
      {/* 小さな箱 */}
      <mesh position={[0, 0.15, 0.05]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.3]} />
        <meshStandardMaterial color="#dcc8aa" roughness={0.85} />
      </mesh>
      {/* 三角の屋根 */}
      <mesh position={[0, 0.42, 0.05]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.3, 0.18, 4]} />
        <meshStandardMaterial color="#7a3a2a" roughness={0.6} />
      </mesh>
      {/* 窓ガラス */}
      <mesh position={[0, 0.15, 0.21]}>
        <planeGeometry args={[0.3, 0.28]} />
        <meshStandardMaterial
          color={accent}
          emissive="#fff5d8"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
      {/* 窓枠 */}
      <mesh position={[0, 0.15, 0.215]}>
        <planeGeometry args={[0.04, 0.28]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
    </group>
  );
}

// ---------- ヘルパー ----------

function makeWindowGlassTexture(): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = 64;
  cnv.height = 80;
  const ctx = cnv.getContext("2d")!;
  // ガラスの暖色グラデーション（室内の灯り風）
  const grd = ctx.createLinearGradient(0, 0, 0, 80);
  grd.addColorStop(0, "#fff8e0");
  grd.addColorStop(1, "#f5cf8a");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 64, 80);
  // 軽い反射を入れる
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(8, 8, 18, 30);
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeLabelTexture(label: string): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = 512;
  cnv.height = 128;
  const ctx = cnv.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 128);
  // 古い銘板風（金色）
  ctx.fillStyle = "rgba(40, 30, 20, 0.92)";
  ctx.fillRect(20, 24, 472, 80);
  ctx.strokeStyle = "rgba(212, 165, 116, 0.95)";
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 32, 456, 64);
  ctx.fillStyle = "#f5cf8a";
  ctx.font = "bold 48px 'Cinzel', 'Hiragino Mincho ProN', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 256, 64);
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
