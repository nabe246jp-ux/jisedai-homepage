"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getTimePalette } from "@/lib/timeOfDay";

type Props = { position?: [number, number, number] };

/**
 * 街の中心にそびえる時計台。
 * - 4面に時計盤
 * - 時針・分針・秒針が実時刻に合わせて滑らかに回る
 * - 文字盤の発光は時間帯に応じて強さが変わる
 */
export default function ClockTower({ position = [0, 0, 0] }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const hourRefs = useRef<THREE.Object3D[]>([]);
  const minuteRefs = useRef<THREE.Object3D[]>([]);
  const secondRefs = useRef<THREE.Object3D[]>([]);
  const faceMatRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const glowRef = useRef<THREE.PointLight>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  // 文字盤テクスチャ（共通で1枚を使い回す）
  const dialTexture = useMemo(() => makeClockFace(512), []);

  // 4面の方向（北・東・南・西）
  const faceDirs = useMemo(
    () =>
      [
        { rot: [0, 0, 0] as [number, number, number], offset: [0, 0, 0.81] as [number, number, number] },
        { rot: [0, Math.PI / 2, 0] as [number, number, number], offset: [0.81, 0, 0] as [number, number, number] },
        { rot: [0, Math.PI, 0] as [number, number, number], offset: [0, 0, -0.81] as [number, number, number] },
        { rot: [0, -Math.PI / 2, 0] as [number, number, number], offset: [-0.81, 0, 0] as [number, number, number] },
      ],
    []
  );

  useFrame(() => {
    const now = virtualDate ?? new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    // 12時=0rad、時計回り
    const hourAng = -(h / 12) * Math.PI * 2;
    const minAng = -(m / 60) * Math.PI * 2;
    const secAng = -(s / 60) * Math.PI * 2;

    hourRefs.current.forEach((r) => r && (r.rotation.z = hourAng));
    minuteRefs.current.forEach((r) => r && (r.rotation.z = minAng));
    secondRefs.current.forEach((r) => r && (r.rotation.z = secAng));

    // 発光強度を時間帯で
    const tp = getTimePalette(now);
    faceMatRefs.current.forEach((mat) => {
      if (!mat) return;
      mat.emissiveIntensity += (tp.clockFaceEmissive - mat.emissiveIntensity) * 0.06;
    });
    if (glowRef.current) {
      const target = tp.clockFaceEmissive * 1.8;
      glowRef.current.intensity += (target - glowRef.current.intensity) * 0.06;
    }

    // 全体に微小な揺らぎ（風で揺れる雰囲気）
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(performance.now() * 0.0006) * 0.0025;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 石の基壇 */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.9, 1.0, 32]} />
        <meshStandardMaterial color="#2e2a32" roughness={0.5} metalness={0.15} />
      </mesh>
      {/* 装飾リング */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <torusGeometry args={[1.65, 0.06, 16, 64]} />
        <meshStandardMaterial color="#a87a4f" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 塔本体（石柱） */}
      <mesh position={[0, 3.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.15, 4.0, 24]} />
        <meshStandardMaterial color="#3a3540" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* 縦の溝（柱の凹凸表現として薄い板を貼る） */}
      {Array.from({ length: 8 }).map((_, i) => {
        const ang = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * 1.05, 3.0, Math.sin(ang) * 1.05]}
            rotation={[0, -ang, 0]}
          >
            <boxGeometry args={[0.04, 3.6, 0.04]} />
            <meshStandardMaterial color="#1a1820" roughness={0.7} metalness={0.2} />
          </mesh>
        );
      })}

      {/* 時計室（4面に文字盤） */}
      <group position={[0, 5.6, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.7, 1.7, 1.7]} />
          <meshStandardMaterial color="#4a3528" roughness={0.45} metalness={0.2} />
        </mesh>

        {/* 上下のブラスのモール */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[1.85, 0.08, 1.85]} />
          <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, -0.92, 0]} castShadow>
          <boxGeometry args={[1.85, 0.08, 1.85]} />
          <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* 4面の文字盤 */}
        {faceDirs.map((d, i) => (
          <group key={i} position={d.offset} rotation={d.rot}>
            {/* 文字盤本体 */}
            <mesh>
              <circleGeometry args={[0.7, 64]} />
              <meshStandardMaterial
                ref={(r) => {
                  if (r) faceMatRefs.current[i] = r;
                }}
                map={dialTexture}
                color="#fef3df"
                emissiveMap={dialTexture}
                emissive="#f5cf8a"
                emissiveIntensity={1.6}
                roughness={0.45}
                metalness={0.0}
                toneMapped={true}
              />
            </mesh>
            {/* 文字盤外周のブラスリング */}
            <mesh position={[0, 0, 0.005]}>
              <ringGeometry args={[0.7, 0.78, 64]} />
              <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* 中心の軸キャップ */}
            <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
              <meshStandardMaterial color="#1a1820" metalness={0.85} roughness={0.2} />
            </mesh>

            {/* 時針（pivot group + 子要素を上にオフセットして根本回転を実現） */}
            <group
              position={[0, 0, 0.03]}
              ref={(r) => {
                if (r) hourRefs.current[i] = r;
              }}
            >
              <mesh position={[0, 0.18, 0]}>
                <boxGeometry args={[0.045, 0.36, 0.012]} />
                <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.36, 0]}>
                <coneGeometry args={[0.035, 0.05, 8]} />
                <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>

            {/* 分針 */}
            <group
              position={[0, 0, 0.04]}
              ref={(r) => {
                if (r) minuteRefs.current[i] = r;
              }}
            >
              <mesh position={[0, 0.275, 0]}>
                <boxGeometry args={[0.025, 0.55, 0.012]} />
                <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.55, 0]}>
                <coneGeometry args={[0.022, 0.045, 8]} />
                <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>

            {/* 秒針（赤） */}
            <group
              position={[0, 0, 0.05]}
              ref={(r) => {
                if (r) secondRefs.current[i] = r;
              }}
            >
              <mesh position={[0, 0.30, 0]}>
                <boxGeometry args={[0.008, 0.6, 0.008]} />
                <meshStandardMaterial color="#d96a3a" emissive="#d96a3a" emissiveIntensity={0.5} />
              </mesh>
            </group>
          </group>
        ))}

        {/* 室内光（夜に文字盤を照らす） */}
        <pointLight ref={glowRef} position={[0, 0, 0]} color="#f5cf8a" intensity={1.6} distance={6} decay={2} />
      </group>

      {/* 時計室の上の天蓋（モール状） */}
      <mesh position={[0, 6.55, 0]} castShadow>
        <boxGeometry args={[1.95, 0.16, 1.95]} />
        <meshStandardMaterial color="#a87a4f" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 屋根（八角錐） */}
      <mesh position={[0, 7.4, 0]} castShadow>
        <coneGeometry args={[1.4, 1.6, 8]} />
        <meshStandardMaterial color="#3a2a55" metalness={0.55} roughness={0.35} />
      </mesh>

      {/* 屋根の縁の金モール */}
      <mesh position={[0, 6.62, 0]} castShadow>
        <torusGeometry args={[1.42, 0.05, 8, 32]} />
        <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* スパイア（先端） */}
      <mesh position={[0, 8.65, 0]} castShadow>
        <coneGeometry args={[0.08, 0.9, 16]} />
        <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* 球体のフィニアル */}
      <mesh position={[0, 8.18, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.15} />
      </mesh>
    </group>
  );
}

// ---------- 文字盤テクスチャ ----------

function makeClockFace(size: number): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.46;

  // 背景
  const g = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
  g.addColorStop(0, "#fff8e8");
  g.addColorStop(0.7, "#f5e6c8");
  g.addColorStop(1, "#d8b889");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // 細い装飾円
  ctx.strokeStyle = "rgba(64,40,20,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.93, 0, Math.PI * 2);
  ctx.stroke();

  // 分の目盛り
  for (let i = 0; i < 60; i++) {
    const ang = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isHour = i % 5 === 0;
    const r1 = radius * (isHour ? 0.78 : 0.85);
    const r2 = radius * 0.92;
    ctx.strokeStyle = "rgba(20,15,10,0.85)";
    ctx.lineWidth = isHour ? 4 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
    ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
    ctx.stroke();
  }

  // ローマ数字
  const numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  ctx.fillStyle = "#1a120a";
  ctx.font = `bold ${Math.round(size * 0.085)}px 'Cinzel', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const r = radius * 0.66;
    ctx.fillText(numerals[i], cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
  }

  // 中央のロゴ
  ctx.fillStyle = "rgba(64,40,20,0.6)";
  ctx.font = `${Math.round(size * 0.04)}px 'Cinzel', serif`;
  ctx.fillText("TECH PARTNERS", cx, cy + radius * 0.32);

  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
