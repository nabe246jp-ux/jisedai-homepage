"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getInterpolatedSeason } from "@/lib/seasons";

/**
 * 街路樹。葉の色は季節で変化、風で揺れる。
 */
export default function Trees() {
  const trees = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; phase: number }[] = [];
    // プラザの少し外側に16本
    const count = 16;
    const r = 13;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + 0.13;
      arr.push({
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r],
        scale: 0.8 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    // 建物の脇にも少し
    const extras: [number, number, number][] = [
      [-9, 0, -3], [-9, 0, 7], [9, 0, -3], [9, 0, 7],
      [-4.5, 0, -7.5], [4.5, 0, -7.5], [-4.5, 0, 7.5], [4.5, 0, 7.5],
    ];
    extras.forEach((p) => arr.push({ pos: p, scale: 0.9 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2 }));
    return arr;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <Tree key={i} position={t.pos} scale={t.scale} phase={t.phase} />
      ))}
    </group>
  );
}

function Tree({
  position,
  scale,
  phase,
}: {
  position: [number, number, number];
  scale: number;
  phase: number;
}) {
  const foliageRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const accentMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  useFrame((state) => {
    const now = virtualDate ?? new Date();
    const season = getInterpolatedSeason(now);
    const t = state.clock.getElapsedTime();

    if (foliageRef.current) {
      foliageRef.current.rotation.z = Math.sin(t * 0.8 + phase) * 0.04;
      foliageRef.current.position.y = 1.3 + Math.sin(t * 0.6 + phase) * 0.02;
    }
    if (matRef.current) {
      matRef.current.color.lerp(new THREE.Color(season.treeAccent), 0.02);
    }
    if (accentMatRef.current) {
      accentMatRef.current.color.lerp(new THREE.Color(season.treeAccent), 0.02);
      accentMatRef.current.emissive.lerp(new THREE.Color(season.treeAccent), 0.02);
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* 幹 */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.2, 10]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* 葉のかたまり（多重球で雲っぽく） */}
      <mesh ref={foliageRef} position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial ref={matRef} color="#5a8a6b" roughness={0.85} metalness={0.0} />
      </mesh>
      <mesh position={[0.3, 1.5, 0.1]} castShadow>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#4a7a5b" roughness={0.85} metalness={0.0} />
      </mesh>
      <mesh position={[-0.25, 1.4, -0.15]} castShadow>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshStandardMaterial color="#5a8a6b" roughness={0.85} metalness={0.0} />
      </mesh>
      {/* 季節アクセント（花や紅葉） */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.62, 16, 16]} />
        <meshStandardMaterial
          ref={accentMatRef}
          color="#5a8a6b"
          emissive="#5a8a6b"
          emissiveIntensity={0.15}
          transparent
          opacity={0.45}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}
