"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * プラザ中央の多段噴水。
 *  - 八角形の池
 *  - 真ん中に大理石の柱と上下2段の皿
 *  - 上から落ちる水（細いシリンダー）
 *  - 中央から噴き上がる水（円錐）
 *  - 水面のゆらぎ
 *  - 夜は青いライトで照らされる
 */
export default function Fountain({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const sprayRef = useRef<THREE.Mesh>(null!);
  const upperWaterRef = useRef<THREE.Mesh>(null!);
  const surfaceRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const dropletRefs = useRef<THREE.Mesh[]>([]);

  // 落ちる水滴
  const droplets = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      angle: (i / 14) * Math.PI * 2,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // 中央の噴き上がる水
    if (sprayRef.current) {
      sprayRef.current.scale.y = 1 + Math.sin(t * 2.4) * 0.07;
      sprayRef.current.rotation.y = t * 0.4;
    }
    // 上の皿から流れ落ちる水のうねり
    if (upperWaterRef.current) {
      upperWaterRef.current.rotation.y = t * 0.6;
      const m = upperWaterRef.current.material as THREE.MeshStandardMaterial;
      m.opacity = 0.35 + Math.sin(t * 3) * 0.05;
    }
    // 水面のゆらぎ（微妙に拡大縮小）
    if (surfaceRef.current) {
      surfaceRef.current.scale.x = 1 + Math.sin(t * 1.2) * 0.005;
      surfaceRef.current.scale.z = 1 + Math.cos(t * 1.4) * 0.005;
    }
    // 落ちる水滴を上下にループ
    dropletRefs.current.forEach((m, i) => {
      if (!m) return;
      const phase = (t * 1.2 + droplets[i].offset) % 1;
      m.position.y = 1.45 - phase * 0.65; // 上の皿から池へ
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.opacity = phase < 0.85 ? 0.85 : 0.0;
    });
    // ライト（時間に応じて強度を呼吸）
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(t * 1.6) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* 池の外側の石枠（八角形） */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <torusGeometry args={[1.85, 0.18, 14, 8]} />
        <meshStandardMaterial color="#e0d4bc" metalness={0.15} roughness={0.55} />
      </mesh>
      {/* 池の縁（座れる幅広の縁） */}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 8]} castShadow>
        <ringGeometry args={[1.6, 1.95, 8]} />
        <meshStandardMaterial color="#cfc6b2" metalness={0.15} roughness={0.5} />
      </mesh>
      {/* 池の底 */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 8]} receiveShadow>
        <circleGeometry args={[1.7, 8]} />
        <meshStandardMaterial color="#2a3a4a" metalness={0.3} roughness={0.55} />
      </mesh>
      {/* 水面 */}
      <mesh ref={surfaceRef} position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 8]}>
        <circleGeometry args={[1.65, 8]} />
        <meshStandardMaterial
          color="#5fa4d4"
          metalness={0.85}
          roughness={0.1}
          emissive="#1a4068"
          emissiveIntensity={0.35}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 中央の柱の基壇 */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.25, 8]} />
        <meshStandardMaterial color="#e8dcc4" metalness={0.15} roughness={0.55} />
      </mesh>
      {/* 中央の柱 */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.85, 16]} />
        <meshStandardMaterial color="#e0d4bc" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* 柱の装飾リング */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <torusGeometry args={[0.27, 0.04, 12, 32]} />
        <meshStandardMaterial color="#d4a574" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 下の皿（大きめ・水を受ける） */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.55, 0.12, 24]} />
        <meshStandardMaterial color="#e8dcc4" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* 下の皿の縁の溝 */}
      <mesh position={[0, 1.42, 0]}>
        <torusGeometry args={[0.83, 0.04, 8, 32]} />
        <meshStandardMaterial color="#d4a574" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* 下の皿の中の水面 */}
      <mesh position={[0, 1.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 32]} />
        <meshStandardMaterial
          color="#7cc4ec"
          metalness={0.85}
          roughness={0.1}
          emissive="#1a4068"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 中段の細い柱 */}
      <mesh position={[0, 1.58, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.4, 12]} />
        <meshStandardMaterial color="#e0d4bc" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* 上の皿（小さめ） */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.32, 0.1, 20]} />
        <meshStandardMaterial color="#e8dcc4" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* 上の皿の中の水面 */}
      <mesh position={[0, 1.91, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.46, 24]} />
        <meshStandardMaterial
          color="#9cd4ec"
          metalness={0.85}
          roughness={0.1}
          emissive="#1a4068"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 上の皿の柱（噴出口） */}
      <mesh position={[0, 2.06, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.3, 12]} />
        <meshStandardMaterial color="#d4a574" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 中央の噴き上がる水（円錐） */}
      <mesh ref={sprayRef} position={[0, 2.55, 0]}>
        <coneGeometry args={[0.18, 0.85, 16, 1, true]} />
        <meshStandardMaterial
          color="#cfe6f5"
          transparent
          opacity={0.45}
          emissive="#aacfee"
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 噴水の頂点のしずく球 */}
      <mesh position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#cfe6f5"
          transparent
          opacity={0.85}
          emissive="#aacfee"
          emissiveIntensity={0.7}
          metalness={0.4}
          roughness={0.05}
        />
      </mesh>

      {/* 上の皿の周りに飛沫リング（うっすら） */}
      <mesh ref={upperWaterRef} position={[0, 1.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.55, 24]} />
        <meshStandardMaterial
          color="#aacfee"
          transparent
          opacity={0.35}
          emissive="#aacfee"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 上の皿から下の皿へ落ちる水滴 */}
      {droplets.map((d, i) => {
        const x = Math.cos(d.angle) * 0.45;
        const z = Math.sin(d.angle) * 0.45;
        return (
          <mesh
            key={i}
            ref={(m) => {
              if (m) dropletRefs.current[i] = m;
            }}
            position={[x, 1.45, z]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#cfe6f5"
              transparent
              opacity={0.85}
              emissive="#aacfee"
              emissiveIntensity={0.5}
              roughness={0.05}
            />
          </mesh>
        );
      })}

      {/* ライトアップ（水面のすぐ上） */}
      <pointLight
        ref={lightRef}
        position={[0, 0.6, 0]}
        color="#aacfee"
        intensity={0.8}
        distance={5}
        decay={2}
      />
    </group>
  );
}
