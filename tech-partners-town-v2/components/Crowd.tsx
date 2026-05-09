"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * 街の人々。
 * - プラザ周辺をぐるぐる歩く
 * - 4方向の道を行き来する
 * - 服の色がバラバラ（朝のラッシュ感）
 */
export default function Crowd() {
  const PLAZA = 30;   // プラザ周辺
  const STREET = 28;  // 道沿い

  // 服の色パレット
  const colors = useMemo(
    () => [
      "#e85a5a", "#5a8ae8", "#5fb87a", "#f5b942",
      "#a878f5", "#ff8aa8", "#3a3a3a", "#c9c0a8",
      "#5a3a78", "#d4a574", "#3a5a78", "#9c4848",
    ],
    []
  );

  return (
    <group>
      {/* プラザ周辺をぐるぐる歩く */}
      <CircleWalkers count={28} centerRadius={9.5} radiusVar={3.5} colors={colors} />
      {/* 4方向の道を行き来 */}
      <StreetWalkers angle={0} count={6} colors={colors} />
      <StreetWalkers angle={Math.PI / 2} count={6} colors={colors} />
      <StreetWalkers angle={Math.PI} count={6} colors={colors} />
      <StreetWalkers angle={-Math.PI / 2} count={6} colors={colors} />
    </group>
  );
}

/* プラザ周辺をぐるぐる */
function CircleWalkers({
  count,
  centerRadius,
  radiusVar,
  colors,
}: {
  count: number;
  centerRadius: number;
  radiusVar: number;
  colors: string[];
}) {
  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        radius: centerRadius + Math.random() * radiusVar,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.4 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
        bobPhase: Math.random() * Math.PI * 2,
        heightScale: 0.85 + Math.random() * 0.25,
        bodyColor: colors[Math.floor(Math.random() * colors.length)],
        headColor: ["#f4d4a4", "#e8c498", "#d4a878", "#a87858"][Math.floor(Math.random() * 4)],
      })),
    [count, centerRadius, radiusVar, colors]
  );

  return (
    <group>
      {data.map((p, i) => (
        <Walker key={i} data={p} kind="circle" />
      ))}
    </group>
  );
}

/* 道沿いを 行ったり来たり */
function StreetWalkers({
  angle,
  count,
  colors,
}: {
  angle: number;
  count: number;
  colors: string[];
}) {
  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        angle,
        offset: 14 + Math.random() * 22,
        side: Math.random() > 0.5 ? 1 : -1,
        speed: 0.06 + Math.random() * 0.08,
        dir: Math.random() > 0.5 ? 1 : -1,
        bobPhase: Math.random() * Math.PI * 2,
        heightScale: 0.85 + Math.random() * 0.25,
        bodyColor: colors[Math.floor(Math.random() * colors.length)],
        headColor: ["#f4d4a4", "#e8c498", "#d4a878", "#a87858"][Math.floor(Math.random() * 4)],
      })),
    [angle, count, colors]
  );

  return (
    <group>
      {data.map((p, i) => (
        <Walker key={i} data={p} kind="street" />
      ))}
    </group>
  );
}

type CircleData = {
  radius: number; angle: number; speed: number; bobPhase: number;
  heightScale: number; bodyColor: string; headColor: string;
};
type StreetData = {
  angle: number; offset: number; side: number; speed: number; dir: number;
  bobPhase: number; heightScale: number; bodyColor: string; headColor: string;
};

function Walker({
  data,
  kind,
}: {
  data: CircleData | StreetData;
  kind: "circle" | "street";
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const armLRef = useRef<THREE.Mesh>(null!);
  const armRRef = useRef<THREE.Mesh>(null!);
  const legLRef = useRef<THREE.Mesh>(null!);
  const legRRef = useRef<THREE.Mesh>(null!);

  // useFrame で歩く
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    let x = 0, z = 0, yawTarget = 0;
    if (kind === "circle") {
      const c = data as CircleData;
      c.angle += c.speed * 0.0035;
      x = Math.cos(c.angle) * c.radius;
      z = Math.sin(c.angle) * c.radius;
      yawTarget = Math.atan2(
        -Math.sin(c.angle) * Math.sign(c.speed),
        Math.cos(c.angle) * Math.sign(c.speed)
      );
    } else {
      const s = data as StreetData;
      // 0..1 でどこにいるか
      s.offset += s.speed * s.dir * 0.04;
      // 範囲を超えたら反転
      if (s.offset > 36) s.dir = -1;
      if (s.offset < 14) s.dir = 1;
      const r = s.offset;
      x = Math.cos(s.angle) * r + Math.sin(s.angle) * (s.side * 1.5);
      z = Math.sin(s.angle) * r - Math.cos(s.angle) * (s.side * 1.5);
      yawTarget = s.angle + (s.dir > 0 ? 0 : Math.PI) + Math.PI / 2;
    }
    const bob = Math.abs(Math.sin(t * 5 + (data as { bobPhase: number }).bobPhase)) * 0.05;
    groupRef.current.position.set(x, bob, z);
    // 滑らかに向きを合わせる
    const cur = groupRef.current.rotation.y;
    let diff = yawTarget - cur;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    groupRef.current.rotation.y = cur + diff * 0.18;

    // 腕脚スイング
    const swing = Math.sin(t * 8 + (data as { bobPhase: number }).bobPhase) * 0.5;
    if (armLRef.current) armLRef.current.rotation.x = swing;
    if (armRRef.current) armRRef.current.rotation.x = -swing;
    if (legLRef.current) legLRef.current.rotation.x = -swing * 0.7;
    if (legRRef.current) legRRef.current.rotation.x = swing * 0.7;
  });

  const hs = data.heightScale;

  return (
    <group ref={groupRef} scale={[hs, hs, hs]}>
      {/* 胴体 */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.32, 0.5, 0.22]} />
        <meshStandardMaterial color={data.bodyColor} roughness={0.85} />
      </mesh>
      {/* 頭 */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color={data.headColor} roughness={0.7} />
      </mesh>
      {/* 髪 */}
      <mesh position={[0, 1.04, -0.02]} castShadow>
        <sphereGeometry args={[0.135, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3a2818" roughness={0.85} />
      </mesh>
      {/* 左腕 */}
      <group position={[-0.22, 0.78, 0]}>
        <mesh ref={armLRef} position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.09, 0.4, 0.09]} />
          <meshStandardMaterial color={data.bodyColor} roughness={0.85} />
        </mesh>
      </group>
      {/* 右腕 */}
      <group position={[0.22, 0.78, 0]}>
        <mesh ref={armRRef} position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.09, 0.4, 0.09]} />
          <meshStandardMaterial color={data.bodyColor} roughness={0.85} />
        </mesh>
      </group>
      {/* 左脚 */}
      <group position={[-0.09, 0.3, 0]}>
        <mesh ref={legLRef} position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.11, 0.42, 0.12]} />
          <meshStandardMaterial color="#1a1820" roughness={0.85} />
        </mesh>
      </group>
      {/* 右脚 */}
      <group position={[0.09, 0.3, 0]}>
        <mesh ref={legRRef} position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.11, 0.42, 0.12]} />
          <meshStandardMaterial color="#1a1820" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}
