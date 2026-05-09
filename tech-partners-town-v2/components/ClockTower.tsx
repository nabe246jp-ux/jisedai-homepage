"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getTimePalette } from "@/lib/timeOfDay";

type Props = { position?: [number, number, number] };

/**
 * 街の中心にそびえる時計台。
 * - 4面に時計盤（アナログ）
 * - 4面に LED風の デジタル時刻表示（HH:MM:SS）
 * - 時針・分針・秒針が滑らかに回る
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

  // デジタル表示用 Canvas（毎フレーム書き換え、4面で共有）
  const digital = useMemo(() => {
    const cnv = document.createElement("canvas");
    cnv.width = 512;
    cnv.height = 128;
    const ctx = cnv.getContext("2d")!;
    const tex = new THREE.CanvasTexture(cnv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { cnv, ctx, tex, lastDrawn: "" };
  }, []);

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

    const hourAng = -(h / 12) * Math.PI * 2;
    const minAng = -(m / 60) * Math.PI * 2;
    const secAng = -(s / 60) * Math.PI * 2;

    hourRefs.current.forEach((r) => r && (r.rotation.z = hourAng));
    minuteRefs.current.forEach((r) => r && (r.rotation.z = minAng));
    secondRefs.current.forEach((r) => r && (r.rotation.z = secAng));

    const tp = getTimePalette(now);
    faceMatRefs.current.forEach((mat) => {
      if (!mat) return;
      mat.emissiveIntensity += (tp.clockFaceEmissive - mat.emissiveIntensity) * 0.06;
    });
    if (glowRef.current) {
      const target = tp.clockFaceEmissive * 1.8;
      glowRef.current.intensity += (target - glowRef.current.intensity) * 0.06;
    }

    // デジタル表示の更新（秒が変わったときだけ描画）
    const HH = pad2(now.getHours());
    const MM = pad2(now.getMinutes());
    const SS = pad2(now.getSeconds());
    const text = `${HH}:${MM}:${SS}`;
    if (text !== digital.lastDrawn) {
      drawDigital(digital.ctx, text);
      digital.tex.needsUpdate = true;
      digital.lastDrawn = text;
    }

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
      <mesh position={[0, 1.05, 0]} castShadow>
        <torusGeometry args={[1.65, 0.06, 16, 64]} />
        <meshStandardMaterial color="#a87a4f" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 塔本体 */}
      <mesh position={[0, 3.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.15, 4.0, 24]} />
        <meshStandardMaterial color="#3a3540" roughness={0.6} metalness={0.1} />
      </mesh>

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

      {/* 時計室 */}
      <group position={[0, 5.6, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.7, 1.9, 1.7]} />
          <meshStandardMaterial color="#4a3528" roughness={0.45} metalness={0.2} />
        </mesh>

        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[1.85, 0.08, 1.85]} />
          <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, -1.02, 0]} castShadow>
          <boxGeometry args={[1.85, 0.08, 1.85]} />
          <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* 4面のアナログ文字盤 + 下のデジタルパネル */}
        {faceDirs.map((d, i) => (
          <group key={i} position={d.offset} rotation={d.rot}>
            {/* 文字盤本体 */}
            <mesh position={[0, 0.15, 0]}>
              <circleGeometry args={[0.62, 64]} />
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
            <mesh position={[0, 0.15, 0.005]}>
              <ringGeometry args={[0.62, 0.7, 64]} />
              <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0.15, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
              <meshStandardMaterial color="#1a1820" metalness={0.85} roughness={0.2} />
            </mesh>

            {/* 時針 */}
            <group
              position={[0, 0.15, 0.03]}
              ref={(r) => {
                if (r) hourRefs.current[i] = r;
              }}
            >
              <mesh position={[0, 0.16, 0]}>
                <boxGeometry args={[0.045, 0.32, 0.012]} />
                <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.32, 0]}>
                <coneGeometry args={[0.035, 0.05, 8]} />
                <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>

            {/* 分針 */}
            <group
              position={[0, 0.15, 0.04]}
              ref={(r) => {
                if (r) minuteRefs.current[i] = r;
              }}
            >
              <mesh position={[0, 0.245, 0]}>
                <boxGeometry args={[0.025, 0.49, 0.012]} />
                <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.49, 0]}>
                <coneGeometry args={[0.022, 0.045, 8]} />
                <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>

            {/* 秒針 */}
            <group
              position={[0, 0.15, 0.05]}
              ref={(r) => {
                if (r) secondRefs.current[i] = r;
              }}
            >
              <mesh position={[0, 0.27, 0]}>
                <boxGeometry args={[0.008, 0.54, 0.008]} />
                <meshStandardMaterial color="#d96a3a" emissive="#d96a3a" emissiveIntensity={0.5} />
              </mesh>
            </group>

            {/* デジタル表示パネル（アナログの下） */}
            <mesh position={[0, -0.62, 0.005]}>
              <planeGeometry args={[1.32, 0.32]} />
              <meshStandardMaterial color="#0a0a14" roughness={0.55} metalness={0.4} />
            </mesh>
            {/* デジタル表示の発光面 */}
            <mesh position={[0, -0.62, 0.012]}>
              <planeGeometry args={[1.22, 0.24]} />
              <meshStandardMaterial
                map={digital.tex}
                emissiveMap={digital.tex}
                emissive="#f5cf8a"
                emissiveIntensity={2.2}
                color="#000000"
                transparent
                toneMapped={false}
              />
            </mesh>
            {/* パネルの金色フレーム */}
            <mesh position={[0, -0.62, 0.008]}>
              <ringGeometry args={[0.0, 0.0, 4]} />
              <meshStandardMaterial color="#d4a574" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        <pointLight ref={glowRef} position={[0, 0, 0]} color="#f5cf8a" intensity={1.6} distance={6} decay={2} />
      </group>

      <mesh position={[0, 6.65, 0]} castShadow>
        <boxGeometry args={[1.95, 0.16, 1.95]} />
        <meshStandardMaterial color="#a87a4f" metalness={0.85} roughness={0.25} />
      </mesh>

      <mesh position={[0, 7.5, 0]} castShadow>
        <coneGeometry args={[1.4, 1.6, 8]} />
        <meshStandardMaterial color="#3a2a55" metalness={0.55} roughness={0.35} />
      </mesh>

      <mesh position={[0, 6.72, 0]} castShadow>
        <torusGeometry args={[1.42, 0.05, 8, 32]} />
        <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
      </mesh>

      <mesh position={[0, 8.75, 0]} castShadow>
        <coneGeometry args={[0.08, 0.9, 16]} />
        <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.15} />
      </mesh>

      <mesh position={[0, 8.28, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.15} />
      </mesh>
    </group>
  );
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function drawDigital(ctx: CanvasRenderingContext2D, text: string) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);
  // 背景は透明（外側は黒い土台、内側は発光のみ）
  ctx.fillStyle = "rgba(8, 6, 12, 1)";
  ctx.fillRect(0, 0, W, H);
  // 細いグリッドライン（LED風）
  ctx.strokeStyle = "rgba(245, 207, 138, 0.05)";
  ctx.lineWidth = 1;
  for (let y = 0; y < H; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  // 文字
  ctx.fillStyle = "#ffe4a8";
  ctx.font = "700 78px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#f5cf8a";
  ctx.shadowBlur = 16;
  ctx.fillText(text, W / 2, H / 2 + 4);
  ctx.shadowBlur = 0;
}

function makeClockFace(size: number): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.46;

  const g = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
  g.addColorStop(0, "#fff8e8");
  g.addColorStop(0.7, "#f5e6c8");
  g.addColorStop(1, "#d8b889");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(64,40,20,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.93, 0, Math.PI * 2);
  ctx.stroke();

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

  ctx.fillStyle = "rgba(64,40,20,0.6)";
  ctx.font = `${Math.round(size * 0.04)}px 'Cinzel', serif`;
  ctx.fillText("TECH PARTNERS", cx, cy + radius * 0.32);

  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
