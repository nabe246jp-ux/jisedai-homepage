"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getInterpolatedSeason, ParticleKind } from "@/lib/seasons";

/**
 * 季節パーティクル。桜・葉・雪・蛍・雨。
 * 種類に応じて挙動と色を切り替える。
 */
const COUNT = 220;

export default function SeasonalParticles() {
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 36;
      arr[i * 3 + 1] = Math.random() * 18 + 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 36;
    }
    return arr;
  }, []);

  const velocities = useMemo(() => {
    const v = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      v[i * 3 + 0] = (Math.random() - 0.5) * 0.02;
      v[i * 3 + 1] = -(Math.random() * 0.04 + 0.02);
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return v;
  }, []);

  const phases = useMemo(() => {
    const p = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) p[i] = Math.random() * Math.PI * 2;
    return p;
  }, []);

  // 円形ソフトテクスチャ
  const sprite = useMemo(() => makeSoftCircle(64), []);

  useFrame((state) => {
    const now = virtualDate ?? new Date();
    const season = getInterpolatedSeason(now);
    const t = state.clock.getElapsedTime();
    const kind: ParticleKind = season.particle;

    if (!pointsRef.current) return;
    const pos = (pointsRef.current.geometry as THREE.BufferGeometry).attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      // 種類別の挙動
      switch (kind) {
        case "sakura":
        case "leaves": {
          const sway = Math.sin(t * 1.2 + phases[i]) * 0.02;
          (pos.array as Float32Array)[ix] += velocities[ix] + sway;
          (pos.array as Float32Array)[iy] += velocities[iy] * 0.6;
          (pos.array as Float32Array)[iz] += velocities[iz] + Math.cos(t * 1.0 + phases[i]) * 0.012;
          break;
        }
        case "snow": {
          const sway = Math.sin(t * 0.7 + phases[i]) * 0.01;
          (pos.array as Float32Array)[ix] += sway;
          (pos.array as Float32Array)[iy] += velocities[iy] * 0.45;
          (pos.array as Float32Array)[iz] += Math.cos(t * 0.6 + phases[i]) * 0.008;
          break;
        }
        case "rain": {
          (pos.array as Float32Array)[iy] += -0.45;
          break;
        }
        case "fireflies": {
          // 蛍は上に向かってふわふわ漂う
          const dx = Math.sin(t * 0.7 + phases[i]) * 0.02;
          const dy = Math.cos(t * 0.5 + phases[i]) * 0.01;
          const dz = Math.sin(t * 0.6 + phases[i] + 1.0) * 0.02;
          (pos.array as Float32Array)[ix] += dx;
          (pos.array as Float32Array)[iy] += dy;
          (pos.array as Float32Array)[iz] += dz;
          break;
        }
        default:
          break;
      }

      // 範囲外で再配置
      if (
        (pos.array as Float32Array)[iy] < 0.2 ||
        Math.abs((pos.array as Float32Array)[ix]) > 20 ||
        Math.abs((pos.array as Float32Array)[iz]) > 20
      ) {
        (pos.array as Float32Array)[ix] = (Math.random() - 0.5) * 36;
        (pos.array as Float32Array)[iy] = 14 + Math.random() * 6;
        (pos.array as Float32Array)[iz] = (Math.random() - 0.5) * 36;
      }
    }
    pos.needsUpdate = true;

    // 色とサイズ
    if (matRef.current) {
      const targetColor = new THREE.Color(
        kind === "sakura"
          ? "#f8b5cc"
          : kind === "leaves"
          ? "#d96a3a"
          : kind === "snow"
          ? "#ffffff"
          : kind === "rain"
          ? "#9bb4cc"
          : kind === "fireflies"
          ? "#fef3a0"
          : "#000000"
      );
      matRef.current.color.lerp(targetColor, 0.08);

      const targetSize =
        kind === "rain"
          ? 0.06
          : kind === "fireflies"
          ? 0.18
          : kind === "snow"
          ? 0.13
          : 0.16;
      matRef.current.size += (targetSize - matRef.current.size) * 0.08;

      const targetOpacity = kind === "none" ? 0 : kind === "fireflies" ? 0.95 : 0.85;
      matRef.current.opacity += (targetOpacity - matRef.current.opacity) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.16}
        map={sprite}
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        color="#ffffff"
      />
    </points>
  );
}

function makeSoftCircle(size: number): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(cnv);
}
