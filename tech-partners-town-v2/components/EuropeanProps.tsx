"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getTimePalette } from "@/lib/timeOfDay";

/**
 * 欧州風の街並みを構成する小物群。
 * - 中央の噴水（水しぶきが揺れる）
 * - 左右のカフェテラス（テーブル・椅子・パラソル）
 * - 曲線のベンチ
 * - 建物入口の植木鉢
 * - 街灯のバナー旗
 */
export default function EuropeanProps() {
  return (
    <group>
      <Fountain position={[0, 0, 8.5]} />
      <CafeTerrace position={[-5, 0, 9]} rotationY={-0.18} accent="#c97a55" name="LE PETIT CAFÉ" />
      <CafeTerrace position={[5, 0, 9]} rotationY={0.18} accent="#5c8a8a" name="BISTRO LUMIÈRE" />

      {/* プラザ縁のベンチ */}
      <Bench position={[-3.2, 0, -10.5]} rotationY={Math.PI} />
      <Bench position={[3.2, 0, -10.5]} rotationY={Math.PI} />
      <Bench position={[-10.5, 0, 0]} rotationY={Math.PI / 2} />
      <Bench position={[10.5, 0, 0]} rotationY={-Math.PI / 2} />

      {/* 建物入口の植木鉢 */}
      <Planter position={[-7 - 1.9, 0, -5 + 1.5]} flower="#e6597a" />
      <Planter position={[-7 + 1.9, 0, -5 + 1.5]} flower="#e6597a" />
      <Planter position={[7 - 1.6, 0, -5 + 1.7]} flower="#f5b942" />
      <Planter position={[7 + 1.6, 0, -5 + 1.7]} flower="#f5b942" />
      <Planter position={[-7 - 1.9, 0, 5 - 1.5]} flower="#a87aff" />
      <Planter position={[-7 + 1.9, 0, 5 - 1.5]} flower="#a87aff" />
      <Planter position={[7 - 1.6, 0, 5 - 1.7]} flower="#5fb87a" />
      <Planter position={[7 + 1.6, 0, 5 - 1.7]} flower="#5fb87a" />

      {/* ヘッジ（建物間の区切り） */}
      <Hedge from={[-3.5, 0, -7]} to={[3.5, 0, -7]} />
      <Hedge from={[-3.5, 0, 7]} to={[3.5, 0, 7]} />

      {/* 街灯に取り付けるバナー旗 */}
      <LampBanners />

      {/* ウェルカムアーチ（店舗エリアへの導線） */}
      <WelcomeArch position={[0, 0, 11.5]} />
    </group>
  );
}

/* ====== 噴水 ====== */
function Fountain({ position }: { position: [number, number, number] }) {
  const sprayRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sprayRef.current) {
      sprayRef.current.scale.y = 1 + Math.sin(t * 2.4) * 0.06;
      sprayRef.current.rotation.y = t * 0.4;
    }
    if (lightRef.current) {
      const tp = getTimePalette(virtualDate ?? new Date());
      const target = 0.6 + tp.lampIntensity * 0.6;
      lightRef.current.intensity += (target - lightRef.current.intensity) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* 外側の池 */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.9, 1.6, 48]} />
        <meshStandardMaterial color="#1f2630" metalness={0.2} roughness={0.5} />
      </mesh>
      {/* 水面 */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 48]} />
        <meshStandardMaterial
          color="#3a78a8"
          metalness={0.7}
          roughness={0.15}
          emissive="#1a4060"
          emissiveIntensity={0.25}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* 池の縁 */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <torusGeometry args={[1.5, 0.13, 14, 48]} />
        <meshStandardMaterial color="#cfc6b6" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* 中央の柱 */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.32, 0.9, 16]} />
        <meshStandardMaterial color="#cfc6b6" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* 上の皿 */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.4, 0.18, 24]} />
        <meshStandardMaterial color="#cfc6b6" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* 上の柱 */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.18, 0.5, 12]} />
        <meshStandardMaterial color="#cfc6b6" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* 噴き上がる水 */}
      <mesh ref={sprayRef} position={[0, 1.85, 0]}>
        <coneGeometry args={[0.3, 0.7, 12, 1, true]} />
        <meshStandardMaterial
          color="#aacfee"
          transparent
          opacity={0.45}
          emissive="#aacfee"
          emissiveIntensity={0.4}
          metalness={0.1}
          roughness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 上のしずく球 */}
      <mesh position={[0, 2.25, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color="#cfe6f5"
          transparent
          opacity={0.8}
          emissive="#aacfee"
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.05}
        />
      </mesh>
      {/* 噴水の照明 */}
      <pointLight ref={lightRef} position={[0, 1.5, 0]} color="#aacfee" intensity={0.6} distance={3.2} />
    </group>
  );
}

/* ====== カフェテラス ====== */
function CafeTerrace({
  position,
  rotationY,
  accent,
  name,
}: {
  position: [number, number, number];
  rotationY: number;
  accent: string;
  name: string;
}) {
  const parasolRefs = useRef<THREE.Group[]>([]);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    parasolRefs.current.forEach((g, i) => {
      if (g) g.rotation.z = Math.sin(t * 0.6 + i) * 0.02;
    });
  });

  const tables: { x: number; z: number }[] = [
    { x: -1.2, z: 0 },
    { x: 0, z: -0.4 },
    { x: 1.2, z: 0 },
  ];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 看板 */}
      <mesh position={[0, 1.6, -1.2]} castShadow>
        <boxGeometry args={[2.6, 0.5, 0.08]} />
        <meshStandardMaterial color="#1a1820" />
      </mesh>
      <mesh position={[0, 1.6, -1.16]}>
        <planeGeometry args={[2.4, 0.36]} />
        <meshBasicMaterial map={makeSignTexture(name, accent)} transparent />
      </mesh>
      {/* 看板を支える柱 */}
      <mesh position={[-1.0, 0.8, -1.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.6, 10]} />
        <meshStandardMaterial color="#3a2a1a" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[1.0, 0.8, -1.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.6, 10]} />
        <meshStandardMaterial color="#3a2a1a" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* 床のラグ風 */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 1.8]} />
        <meshStandardMaterial color="#2a1f18" roughness={0.85} />
      </mesh>

      {/* テーブルとパラソル */}
      {tables.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          {/* 椅子1 */}
          <Chair offset={[-0.4, 0, 0.1]} />
          {/* 椅子2 */}
          <Chair offset={[0.4, 0, 0.1]} />
          {/* テーブル天板 */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.04, 24]} />
            <meshStandardMaterial color="#cfc6b6" metalness={0.1} roughness={0.5} />
          </mesh>
          {/* 脚 */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.65, 10]} />
            <meshStandardMaterial color="#1a1820" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* パラソル */}
          <group
            ref={(r) => {
              if (r) parasolRefs.current[i] = r;
            }}
          >
            {/* 柱 */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
              <meshStandardMaterial color="#3a2a1a" />
            </mesh>
            {/* 傘 */}
            <mesh position={[0, 1.95, 0]} castShadow>
              <coneGeometry args={[0.7, 0.3, 12]} />
              <meshStandardMaterial color={accent} side={THREE.DoubleSide} roughness={0.7} />
            </mesh>
            <mesh position={[0, 2.05, 0]}>
              <coneGeometry args={[0.05, 0.1, 8]} />
              <meshStandardMaterial color="#d4a574" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      ))}

      {/* 入口の小さなプランター */}
      <mesh position={[-1.4, 0.18, -0.5]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.36, 16]} />
        <meshStandardMaterial color="#8a7a6a" metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh position={[-1.4, 0.42, -0.5]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#5a8a6b" />
      </mesh>
      <mesh position={[1.4, 0.18, -0.5]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.36, 16]} />
        <meshStandardMaterial color="#8a7a6a" metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh position={[1.4, 0.42, -0.5]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#5a8a6b" />
      </mesh>
    </group>
  );
}

function Chair({ offset }: { offset: [number, number, number] }) {
  return (
    <group position={offset}>
      {/* 座面 */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.24, 0.04, 0.24]} />
        <meshStandardMaterial color="#cfc6b6" metalness={0.2} roughness={0.55} />
      </mesh>
      {/* 背もたれ */}
      <mesh position={[0, 0.5, -0.1]} castShadow>
        <boxGeometry args={[0.24, 0.32, 0.04]} />
        <meshStandardMaterial color="#cfc6b6" metalness={0.2} roughness={0.55} />
      </mesh>
      {/* 4本脚 */}
      {[
        [-0.1, 0, -0.1],
        [0.1, 0, -0.1],
        [-0.1, 0, 0.1],
        [0.1, 0, 0.1],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 0.16, p[2]]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.32, 6]} />
          <meshStandardMaterial color="#1a1820" />
        </mesh>
      ))}
    </group>
  );
}

/* ====== ベンチ ====== */
function Bench({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 座面板 */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.36]} />
        <meshStandardMaterial color="#3a2a1a" metalness={0.1} roughness={0.7} />
      </mesh>
      {/* 背もたれ */}
      <mesh position={[0, 0.7, -0.16]} castShadow>
        <boxGeometry args={[1.6, 0.5, 0.05]} />
        <meshStandardMaterial color="#3a2a1a" metalness={0.1} roughness={0.7} />
      </mesh>
      {/* 装飾の鋳鉄サイド */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.08, 0.4, 0.36]} />
            <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.55, -0.16]} castShadow>
            <boxGeometry args={[0.08, 0.3, 0.05]} />
            <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ====== 植木鉢 ====== */
function Planter({
  position,
  flower,
}: {
  position: [number, number, number];
  flower: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.36, 16]} />
        <meshStandardMaterial color="#9a8a72" metalness={0.1} roughness={0.7} />
      </mesh>
      {/* 装飾リム */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <torusGeometry args={[0.22, 0.02, 8, 24]} />
        <meshStandardMaterial color="#d4a574" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* 緑 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#4a7a5b" />
      </mesh>
      {/* 花 */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.18, 0.6 + Math.sin(i) * 0.04, Math.sin(a) * 0.18]}
            castShadow
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color={flower}
              emissive={flower}
              emissiveIntensity={0.25}
              roughness={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ====== ヘッジ ====== */
function Hedge({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const length = Math.hypot(to[0] - from[0], to[2] - from[2]);
  const cx = (from[0] + to[0]) / 2;
  const cz = (from[2] + to[2]) / 2;
  const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);

  return (
    <group position={[cx, 0, cz]} rotation={[0, -angle, 0]}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.6, 0.4]} />
        <meshStandardMaterial color="#3a5a3a" roughness={0.85} />
      </mesh>
      {/* 上面の質感 */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[length, 0.04, 0.42]} />
        <meshStandardMaterial color="#5a8a4a" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ====== 街灯バナー ====== */
function LampBanners() {
  const banners = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number; color: string }[] = [];
    const colors = ["#9c2c2c", "#2c4a9c", "#2c8a5a", "#9c7a2c"];
    const count = 12;
    const r = 11;
    for (let i = 0; i < count; i += 2) {
      const a = (i / count) * Math.PI * 2;
      arr.push({
        pos: [Math.cos(a) * r, 1.6, Math.sin(a) * r],
        rot: -a,
        color: colors[(i / 2) % colors.length],
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {banners.map((b, i) => (
        <Banner key={i} position={b.pos} rotationY={b.rot} color={b.color} />
      ))}
    </group>
  );
}

function Banner({
  position,
  rotationY,
  color,
}: {
  position: [number, number, number];
  rotationY: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(t * 1.4 + position[0]) * 0.05;
    }
  });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh ref={meshRef} position={[0.32, 0, 0]} castShadow>
        <planeGeometry args={[0.6, 0.9]} />
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
          roughness={0.85}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

/* ====== ウェルカムアーチ ====== */
function WelcomeArch({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 左柱 */}
      <mesh position={[-2.0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.18, 3.0, 0.18]} />
        <meshStandardMaterial color="#1a1820" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* 右柱 */}
      <mesh position={[2.0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.18, 3.0, 0.18]} />
        <meshStandardMaterial color="#1a1820" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* 上のアーチ */}
      <mesh position={[0, 3.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[2.0, 0.05, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#1a1820" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* 中央のサイン */}
      <mesh position={[0, 3.4, 0]}>
        <planeGeometry args={[2.4, 0.5]} />
        <meshBasicMaterial map={makeSignTexture("WELCOME", "#d4a574")} transparent />
      </mesh>
      {/* 街灯っぽい飾り球 */}
      <mesh position={[-2.0, 3.05, 0]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#fff8e0"
          emissive="#f5cf8a"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[2.0, 3.05, 0]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#fff8e0"
          emissive="#f5cf8a"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

/* ====== 看板テクスチャ ====== */
function makeSignTexture(text: string, accent: string): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = 512;
  cnv.height = 128;
  const ctx = cnv.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 128);
  // 背景
  ctx.fillStyle = "rgba(20, 18, 28, 0.95)";
  ctx.fillRect(0, 0, 512, 128);
  // 上下の縁
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 512, 6);
  ctx.fillRect(0, 122, 512, 6);
  // テキスト
  ctx.fillStyle = "#f5e6c8";
  ctx.font = "600 38px 'Cinzel', 'Hiragino Mincho ProN', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
