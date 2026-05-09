"use client";

import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore, type BuildingKey } from "@/lib/store";
import { getTimePalette } from "@/lib/timeOfDay";

type BuildingDef = {
  key: BuildingKey;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  accent: string;
  label: string;
};

export default function Buildings() {
  const buildings: BuildingDef[] = useMemo(
    () => [
      {
        key: "training",
        position: [-7, 0, -5],
        size: [3.4, 4.5, 2.6],
        color: "#3a4258",
        accent: "#6c7a93",
        label: "研修",
      },
      {
        key: "business",
        position: [7, 0, -5],
        size: [3.0, 5.6, 3.0],
        color: "#5a3a3a",
        accent: "#9c6868",
        label: "事業",
      },
      {
        key: "welfare",
        position: [-7, 0, 5],
        size: [3.4, 3.8, 2.6],
        color: "#3a5048",
        accent: "#7ca088",
        label: "福利厚生",
      },
      {
        key: "company",
        position: [7, 0, 5],
        size: [3.0, 4.2, 2.8],
        color: "#4a3a55",
        accent: "#8c7a9c",
        label: "会社概要",
      },
    ],
    []
  );

  return (
    <group>
      {buildings.map((b, i) => (
        <Building
          key={b.key}
          bkey={b.key}
          position={b.position}
          size={b.size}
          color={b.color}
          accent={b.accent}
          label={b.label}
          index={i}
        />
      ))}
    </group>
  );
}

type BuildingProps = {
  bkey: BuildingKey;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  accent: string;
  label: string;
  index: number;
};

function Building({ bkey, position, size, color, accent, label, index }: BuildingProps) {
  const buildingKey = bkey;
  const groupRef = useRef<THREE.Group>(null!);
  const winMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const beaconRef = useRef<THREE.PointLight>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);

  const virtualDate = useStore((s) => s.virtualDate);
  const lastKpiUpdate = useStore((s) => s.lastKpiUpdate);
  const selectedBuilding = useStore((s) => s.selectedBuilding);
  const hoveredBuilding = useStore((s) => s.hoveredBuilding);
  const setSelectedBuilding = useStore((s) => s.setSelectedBuilding);
  const setHoveredBuilding = useStore((s) => s.setHoveredBuilding);

  const [w, h, d] = size;

  const windowMap = useMemo(() => makeWindowTexture(256, 384, accent), [accent]);

  useFrame((state) => {
    const now = virtualDate ?? new Date();
    const tp = getTimePalette(now);
    const t = state.clock.getElapsedTime();
    const isHovered = hoveredBuilding === buildingKey;
    const isSelected = selectedBuilding === buildingKey;
    const focused = isHovered || isSelected;

    if (groupRef.current) {
      const baseY = Math.sin(t * 0.4 + index * 1.7) * 0.04;
      const targetY = baseY + (focused ? 0.18 : 0);
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.08;
    }
    if (winMatRef.current) {
      const baseTarget = 0.3 + tp.lampIntensity * 1.6;
      const focusBoost = focused ? 1.2 : 0;
      const target = baseTarget + focusBoost;
      winMatRef.current.emissiveIntensity +=
        (target - winMatRef.current.emissiveIntensity) * 0.05;

      const since = Date.now() - lastKpiUpdate;
      if (since < 1500 && lastKpiUpdate > 0) {
        const k = 1 - since / 1500;
        winMatRef.current.emissiveIntensity += k * 1.2 * (Math.sin(t * 18) * 0.5 + 0.8);
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.2 + index;
      const sBase = 1;
      const sTarget = focused ? 1.6 : sBase;
      const cur = ringRef.current.scale.x;
      const next = cur + (sTarget - cur) * 0.08;
      ringRef.current.scale.set(next, next, next);
    }
    if (beaconRef.current) {
      const target = focused ? 1.4 : 0;
      beaconRef.current.intensity += (target - beaconRef.current.intensity) * 0.12;
    }
    if (haloRef.current) {
      const targetOpacity = focused ? 0.55 : 0;
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
      haloRef.current.rotation.z = t * 0.6;
    }
  });

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredBuilding(buildingKey);
    document.body.style.cursor = "pointer";
  };
  const onPointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredBuilding(null);
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedBuilding(buildingKey);
  };

  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={haloRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <ringGeometry args={[w * 0.7, w * 0.95, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0} />
      </mesh>

      <group onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.4, 0.3, d + 0.4]} />
          <meshStandardMaterial color="#1f1d24" metalness={0.3} roughness={0.5} />
        </mesh>

        <mesh position={[0, h / 2 + 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} metalness={0.25} roughness={0.55} />
        </mesh>

        <mesh position={[0, h / 2 + 0.3, d / 2 + 0.001]}>
          <planeGeometry args={[w * 0.85, h * 0.82]} />
          <meshStandardMaterial
            ref={winMatRef}
            map={windowMap}
            emissiveMap={windowMap}
            emissive={new THREE.Color(accent)}
            emissiveIntensity={1.0}
            metalness={0.45}
            roughness={0.18}
            color="#2a2630"
            toneMapped
          />
        </mesh>
        <mesh position={[0, h / 2 + 0.3, -d / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[w * 0.85, h * 0.82]} />
          <meshStandardMaterial
            map={windowMap}
            emissiveMap={windowMap}
            emissive={new THREE.Color(accent)}
            emissiveIntensity={1.0}
            metalness={0.45}
            roughness={0.18}
            color="#2a2630"
          />
        </mesh>
        <mesh position={[w / 2 + 0.001, h / 2 + 0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[d * 0.8, h * 0.82]} />
          <meshStandardMaterial
            map={windowMap}
            emissiveMap={windowMap}
            emissive={new THREE.Color(accent)}
            emissiveIntensity={1.0}
            metalness={0.45}
            roughness={0.18}
            color="#2a2630"
          />
        </mesh>
        <mesh position={[-w / 2 - 0.001, h / 2 + 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[d * 0.8, h * 0.82]} />
          <meshStandardMaterial
            map={windowMap}
            emissiveMap={windowMap}
            emissive={new THREE.Color(accent)}
            emissiveIntensity={1.0}
            metalness={0.45}
            roughness={0.18}
            color="#2a2630"
          />
        </mesh>

        <mesh position={[0, h + 0.35, 0]} castShadow>
          <boxGeometry args={[w + 0.1, 0.18, d + 0.1]} />
          <meshStandardMaterial color="#1a1820" metalness={0.3} roughness={0.6} />
        </mesh>

        <mesh ref={ringRef} position={[0, h + 1.0, 0]}>
          <torusGeometry args={[0.55, 0.025, 12, 64]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, h + 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
          <meshStandardMaterial color="#d4a574" metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.55, d / 2 + 0.02]}>
          <planeGeometry args={[1.4, 0.3]} />
          <meshBasicMaterial map={makeLabelTexture(label)} transparent />
        </mesh>
      </group>

      <pointLight
        ref={beaconRef}
        position={[0, h + 1.4, 0]}
        color={accent}
        intensity={0}
        distance={5}
        decay={2}
      />
    </group>
  );
}

function makeWindowTexture(w: number, h: number, accent: string): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = w;
  cnv.height = h;
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "#1a1820";
  ctx.fillRect(0, 0, w, h);

  const cols = 6;
  const rows = 9;
  const pad = 6;
  const cellW = (w - pad * (cols + 1)) / cols;
  const cellH = (h - pad * (rows + 1)) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * (cellW + pad);
      const y = pad + r * (cellH + pad);
      const on = Math.random() > 0.3;
      if (on) {
        const grd = ctx.createLinearGradient(x, y, x, y + cellH);
        grd.addColorStop(0, "#fff8e8");
        grd.addColorStop(1, accent);
        ctx.fillStyle = grd;
      } else {
        ctx.fillStyle = "#0a0a10";
      }
      ctx.fillRect(x, y, cellW, cellH);
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellW, cellH);
      ctx.beginPath();
      ctx.moveTo(x + cellW / 2, y);
      ctx.lineTo(x + cellW / 2, y + cellH);
      ctx.moveTo(x, y + cellH / 2);
      ctx.lineTo(x + cellW, y + cellH / 2);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeLabelTexture(label: string): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = 512;
  cnv.height = 128;
  const ctx = cnv.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 128);
  ctx.fillStyle = "rgba(212, 165, 116, 0.95)";
  ctx.fillRect(20, 24, 472, 80);
  ctx.strokeStyle = "rgba(40, 30, 20, 0.9)";
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 24, 472, 80);
  ctx.fillStyle = "#1a1208";
  ctx.font = "bold 56px 'Cinzel', 'Hiragino Mincho ProN', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 256, 64);
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
