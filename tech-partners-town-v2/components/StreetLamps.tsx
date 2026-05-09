"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getTimePalette } from "@/lib/timeOfDay";

/**
 * 街灯（ガス灯風）。プラザの円周上に等間隔で並べる。
 * 夜は暖色のpoint lightが灯る。
 */
export default function StreetLamps() {
  const lamps = useMemo(() => {
    const arr: { pos: [number, number, number] }[] = [];
    const count = 12;
    const r = 11;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      arr.push({ pos: [Math.cos(a) * r, 0, Math.sin(a) * r] });
    }
    return arr;
  }, []);

  return (
    <group>
      {lamps.map((l, i) => (
        <Lamp key={i} position={l.pos} index={i} />
      ))}
    </group>
  );
}

function Lamp({ position, index }: { position: [number, number, number]; index: number }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  useFrame((state) => {
    const now = virtualDate ?? new Date();
    const tp = getTimePalette(now);
    const t = state.clock.getElapsedTime();
    // 微妙な揺らぎ
    const flicker = 0.92 + Math.sin(t * 6 + index * 0.7) * 0.06;
    const target = tp.lampIntensity * flicker;
    if (matRef.current) {
      matRef.current.emissiveIntensity += (target * 4 - matRef.current.emissiveIntensity) * 0.1;
    }
    if (lightRef.current) {
      lightRef.current.intensity += (target * 1.6 - lightRef.current.intensity) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* 支柱 */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 2.4, 12]} />
        <meshStandardMaterial color="#1a1820" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* 装飾アーム */}
      <mesh position={[0, 2.45, 0]} castShadow>
        <torusGeometry args={[0.1, 0.02, 8, 16]} />
        <meshStandardMaterial color="#d4a574" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* ランタン */}
      <mesh position={[0, 2.75, 0]} castShadow>
        <boxGeometry args={[0.22, 0.28, 0.22]} />
        <meshStandardMaterial
          ref={matRef}
          color="#fff8e0"
          emissive="#f5cf8a"
          emissiveIntensity={0.0}
          transparent
          opacity={0.95}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      {/* ランタンの枠 */}
      <mesh position={[0, 2.75, 0]} castShadow>
        <boxGeometry args={[0.24, 0.30, 0.24]} />
        <meshStandardMaterial
          color="#1a1820"
          metalness={0.7}
          roughness={0.4}
          wireframe
          opacity={0.3}
          transparent
        />
      </mesh>
      {/* 笠 */}
      <mesh position={[0, 2.96, 0]} castShadow>
        <coneGeometry args={[0.18, 0.14, 8]} />
        <meshStandardMaterial color="#1a1820" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* 光源 */}
      <pointLight
        ref={lightRef}
        position={[0, 2.75, 0]}
        color="#f5cf8a"
        intensity={0}
        distance={6}
        decay={2}
      />
    </group>
  );
}
