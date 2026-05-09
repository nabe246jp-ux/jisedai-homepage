"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * 道路と歩道。
 * - プラザを取り囲む環状の石畳道
 * - 4方向に伸びる放射状の道（建物方向）
 * - 横断歩道
 */
export default function Roads() {
  const cobbleMap = useMemo(() => {
    const tex = makeCobbleTexture(256);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    return tex;
  }, []);

  // 4方向の道の角度
  const radials = [
    { angle: 0, length: 22 },
    { angle: Math.PI / 2, length: 22 },
    { angle: Math.PI, length: 22 },
    { angle: -Math.PI / 2, length: 22 },
  ];

  return (
    <group>
      {/* 環状の道（プラザの外周） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[14, 17, 64]} />
        <meshStandardMaterial
          map={(() => {
            const t = cobbleMap.clone();
            t.repeat.set(20, 4);
            return t;
          })()}
          color="#cfc4b0"
          metalness={0.05}
          roughness={0.7}
        />
      </mesh>

      {/* 4方向の放射状の道 */}
      {radials.map((r, i) => {
        const cx = Math.cos(r.angle) * (14 + r.length / 2);
        const cz = Math.sin(r.angle) * (14 + r.length / 2);
        return (
          <group key={i}>
            <mesh
              rotation={[-Math.PI / 2, 0, -r.angle]}
              position={[cx, 0.015, cz]}
              receiveShadow
            >
              <planeGeometry args={[r.length, 5]} />
              <meshStandardMaterial
                map={(() => {
                  const t = cobbleMap.clone();
                  t.repeat.set(8, 2);
                  return t;
                })()}
                color="#cfc4b0"
                metalness={0.05}
                roughness={0.7}
              />
            </mesh>
            {/* 歩道（道路の両側） */}
            <mesh
              rotation={[-Math.PI / 2, 0, -r.angle]}
              position={[
                cx + Math.sin(r.angle) * 3.0,
                0.025,
                cz - Math.cos(r.angle) * 3.0,
              ]}
              receiveShadow
            >
              <planeGeometry args={[r.length, 1.0]} />
              <meshStandardMaterial color="#dcd4c4" roughness={0.6} />
            </mesh>
            <mesh
              rotation={[-Math.PI / 2, 0, -r.angle]}
              position={[
                cx - Math.sin(r.angle) * 3.0,
                0.025,
                cz + Math.cos(r.angle) * 3.0,
              ]}
              receiveShadow
            >
              <planeGeometry args={[r.length, 1.0]} />
              <meshStandardMaterial color="#dcd4c4" roughness={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* 横断歩道（プラザ入口、4方向） */}
      {radials.map((r, i) => {
        const cx = Math.cos(r.angle) * 15.5;
        const cz = Math.sin(r.angle) * 15.5;
        return (
          <group key={`cross-${i}`} position={[cx, 0.03, cz]} rotation={[0, -r.angle, 0]}>
            {[-1.6, -0.8, 0, 0.8, 1.6].map((off, j) => (
              <mesh key={j} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, off]} receiveShadow>
                <planeGeometry args={[1.4, 0.35]} />
                <meshStandardMaterial color="#fffbe8" roughness={0.4} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function makeCobbleTexture(size: number): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "#bcae94";
  ctx.fillRect(0, 0, size, size);

  // ランダムな石を散らす
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      const ox = (Math.random() - 0.5) * 6;
      const oy = (Math.random() - 0.5) * 6;
      const cx = (c + 0.5) * (size / 12) + ox;
      const cy = (r + 0.5) * (size / 12) + oy;
      const radius = size / 26 + Math.random() * 4;
      const shade = 180 + Math.random() * 50;
      ctx.fillStyle = `rgb(${shade - 10},${shade - 20},${shade - 40})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * (0.7 + Math.random() * 0.4), 0, 0, Math.PI * 2);
      ctx.fill();
      // ハイライト
      ctx.fillStyle = `rgba(255,255,240,0.18)`;
      ctx.beginPath();
      ctx.ellipse(cx - radius * 0.3, cy - radius * 0.3, radius * 0.4, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // 暗い目地
  ctx.strokeStyle = "rgba(60,50,40,0.5)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.lineTo(Math.random() * size, Math.random() * size);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
