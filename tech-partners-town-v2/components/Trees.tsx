"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getInterpolatedSeason } from "@/lib/seasons";

/**
 * 巨木群。参考画像のように 街全体を 緑が 覆う 雰囲気を 出すため、
 * 建物より 高い 大樹を 大量に 配置する。
 */
export default function Trees() {
  const trees = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; phase: number; tone: string }[] = [];
    const tones = ["#5a8a5a", "#4a7a4a", "#6a9a5a", "#7aaa6a", "#3a6a3a", "#5a8a4a"];

    // 街路樹（プラザ内側）
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + 0.13;
      arr.push({
        pos: [Math.cos(a) * 13, 0, Math.sin(a) * 13],
        scale: 1.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        tone: tones[Math.floor(Math.random() * tones.length)],
      });
    }

    // 中間ゾーンの 巨木（建物と建物の間に そびえる）
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      const onRoad = Math.abs(Math.cos(a)) > 0.96 || Math.abs(Math.sin(a)) > 0.96;
      if (onRoad) continue;
      const r = 19 + (Math.random() - 0.5) * 3;
      arr.push({
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r],
        scale: 2.4 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        tone: tones[Math.floor(Math.random() * tones.length)],
      });
    }

    // 外周の 巨木（背景の壁のように）
    for (let i = 0; i < 28; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 28 + Math.random() * 10;
      arr.push({
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r],
        scale: 3.0 + Math.random() * 2.0,
        phase: Math.random() * Math.PI * 2,
        tone: tones[Math.floor(Math.random() * tones.length)],
      });
    }

    // 主要建物の脇
    const sides: [number, number, number][] = [
      [-9, 0, -3], [-9, 0, 7], [9, 0, -3], [9, 0, 7],
      [-4.5, 0, -7.5], [4.5, 0, -7.5], [-4.5, 0, 7.5], [4.5, 0, 7.5],
    ];
    sides.forEach((p) =>
      arr.push({
        pos: p,
        scale: 1.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        tone: tones[Math.floor(Math.random() * tones.length)],
      })
    );
    return arr;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <Tree key={i} position={t.pos} scale={t.scale} phase={t.phase} tone={t.tone} />
      ))}
    </group>
  );
}

function Tree({
  position,
  scale,
  phase,
  tone,
}: {
  position: [number, number, number];
  scale: number;
  phase: number;
  tone: string;
}) {
  const foliageRef = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  useFrame((state) => {
    const now = virtualDate ?? new Date();
    const season = getInterpolatedSeason(now);
    const t = state.clock.getElapsedTime();
    if (foliageRef.current) {
      foliageRef.current.rotation.z = Math.sin(t * 0.6 + phase) * 0.03;
      foliageRef.current.position.y = 2.0 + Math.sin(t * 0.5 + phase) * 0.04;
    }
    if (matRef.current) {
      matRef.current.color.lerp(new THREE.Color(season.treeAccent), 0.02);
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* 太い幹 */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 2.0, 12]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* 巨大な 葉のかたまり（多重球） */}
      <group ref={foliageRef} position={[0, 2.0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshStandardMaterial ref={matRef} color={tone} roughness={0.9} />
        </mesh>
        <mesh position={[0.7, 0.5, 0.3]} castShadow>
          <sphereGeometry args={[1.0, 12, 12]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
        <mesh position={[-0.8, 0.4, -0.4]} castShadow>
          <sphereGeometry args={[1.1, 12, 12]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
        <mesh position={[0.0, 1.0, 0.0]} castShadow>
          <sphereGeometry args={[0.95, 12, 12]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
        <mesh position={[-0.4, 0.7, 0.7]} castShadow>
          <sphereGeometry args={[0.85, 12, 12]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
        <mesh position={[0.5, 1.1, -0.5]} castShadow>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
        {/* 上に飛び出る もくもく */}
        <mesh position={[0.2, 1.6, 0.0]} castShadow>
          <sphereGeometry args={[0.6, 12, 12]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
