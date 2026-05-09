"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getInterpolatedSeason } from "@/lib/seasons";

/**
 * 街路樹。建物より低めに保ち、シーンを覆い隠さないサイズに調整。
 */
export default function Trees() {
  const trees = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; phase: number; tone: string }[] = [];
    const tones = ["#5a8a5a", "#4a7a4a", "#6a9a5a", "#7aaa6a", "#3a6a3a"];

    // 街路樹（プラザ内側） - 街灯と同じくらいの 高さ
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + 0.13;
      arr.push({
        pos: [Math.cos(a) * 13, 0, Math.sin(a) * 13],
        scale: 0.7 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        tone: tones[Math.floor(Math.random() * tones.length)],
      });
    }

    // 中間ゾーン（建物の合間）
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + 0.05;
      const onRoad = Math.abs(Math.cos(a)) > 0.96 || Math.abs(Math.sin(a)) > 0.96;
      if (onRoad) continue;
      const r = 19 + (Math.random() - 0.5) * 2;
      arr.push({
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r],
        scale: 0.9 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        tone: tones[Math.floor(Math.random() * tones.length)],
      });
    }

    // 外周（背景の緑）
    for (let i = 0; i < 22; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 30 + Math.random() * 8;
      arr.push({
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r],
        scale: 1.1 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        tone: tones[Math.floor(Math.random() * tones.length)],
      });
    }

    // 主要建物の脇 - 控えめ
    const sides: [number, number, number][] = [
      [-9.5, 0, -2.5], [-9.5, 0, 7.5], [9.5, 0, -2.5], [9.5, 0, 7.5],
    ];
    sides.forEach((p) =>
      arr.push({
        pos: p,
        scale: 0.7 + Math.random() * 0.2,
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
      foliageRef.current.rotation.z = Math.sin(t * 0.7 + phase) * 0.04;
      foliageRef.current.position.y = 1.5 + Math.sin(t * 0.6 + phase) * 0.025;
    }
    if (matRef.current) {
      matRef.current.color.lerp(new THREE.Color(season.treeAccent), 0.02);
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* 幹 */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.10, 0.16, 1.4, 10]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* 葉のかたまり（控えめなサイズ） */}
      <group ref={foliageRef} position={[0, 1.5, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.7, 14, 14]} />
          <meshStandardMaterial ref={matRef} color={tone} roughness={0.9} />
        </mesh>
        <mesh position={[0.35, 0.2, 0.1]} castShadow>
          <sphereGeometry args={[0.5, 10, 10]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
        <mesh position={[-0.3, 0.15, -0.2]} castShadow>
          <sphereGeometry args={[0.5, 10, 10]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
        <mesh position={[0.0, 0.45, 0.0]} castShadow>
          <sphereGeometry args={[0.4, 10, 10]} />
          <meshStandardMaterial color={tone} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
