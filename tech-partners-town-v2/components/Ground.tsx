"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getInterpolatedSeason } from "@/lib/seasons";

export default function Ground() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  const { colorMap, normalMap, roughMap } = useMemo(() => {
    const size = 256;
    const c = makeStoneColor(size);
    const n = makeStoneNormal(size);
    const r = makeStoneRough(size);
    [c, n, r].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(20, 20);
      t.anisotropy = 8;
    });
    return { colorMap: c, normalMap: n, roughMap: r };
  }, []);

  useFrame(() => {
    if (!matRef.current) return;
    const now = virtualDate ?? new Date();
    const season = getInterpolatedSeason(now);
    matRef.current.color.lerp(new THREE.Color(season.ground), 0.04);
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial
          ref={matRef}
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughMap}
          color="#e8e0d4"
          metalness={0.05}
          roughness={0.6}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <ringGeometry args={[14, 80, 64]} />
        <meshStandardMaterial color="#7a9a6a" roughness={0.95} metalness={0.0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <ringGeometry args={[1.6, 2.6, 48]} />
        <meshStandardMaterial color="#bfb6a6" metalness={0.4} roughness={0.35} />
      </mesh>
    </>
  );
}

function makeStoneColor(size: number): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "#e2dac9";
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (Math.random() - 0.5) * 26;
    img.data[i] = clamp(img.data[i] + v);
    img.data[i + 1] = clamp(img.data[i + 1] + v);
    img.data[i + 2] = clamp(img.data[i + 2] + v);
  }
  ctx.putImageData(img, 0, 0);
  ctx.strokeStyle = "rgba(80,70,60,0.5)";
  ctx.lineWidth = 1.2;
  const step = size / 4;
  for (let y = 0; y < size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  for (let x = 0; x < size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeStoneNormal(size: number): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "rgb(128,128,255)";
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    img.data[i] = clamp(128 + n);
    img.data[i + 1] = clamp(128 + n * 0.8);
    img.data[i + 2] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(cnv);
}

function makeStoneRough(size: number): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "rgb(150,150,150)";
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = clamp(150 + (Math.random() - 0.5) * 80);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(cnv);
}

function clamp(v: number) {
  return Math.max(0, Math.min(255, v));
}
