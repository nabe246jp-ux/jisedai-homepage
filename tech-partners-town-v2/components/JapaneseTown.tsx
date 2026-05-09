"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getTimePalette } from "@/lib/timeOfDay";

/**
 * 参考画像（ジブリ／新海誠 風 アジア幻想都市）に寄せた街並み。
 *  - 緑のドーム屋根の 円筒塔（街のランドマーク 4基）
 *  - 多層の和風タウンハウス（密集）
 *  - 建物間に 木造の連絡橋
 *  - 大量のカラフルな 吊り看板（漢字）
 *  - 紙提灯の 串
 *  - 緑色の 木製アーチ
 *  - 屋台
 *  - 垂れ下がる蔓
 */
export default function JapaneseTown() {
  return (
    <group>
      {/* ランドマーク: 緑のドーム屋根の円筒塔 */}
      <DomeTower position={[14, 0, -16]} radius={1.8} height={9.5} />
      <DomeTower position={[-15, 0, -14]} radius={1.5} height={8.0} />
      <DomeTower position={[18, 0, 8]} radius={2.0} height={11.0} />
      <DomeTower position={[-18, 0, 10]} radius={1.6} height={9.0} />
      <DomeTower position={[0, 0, -22]} radius={1.7} height={10.0} domeColor="#5a8a78" />

      {/* 多層の密集タウンハウス */}
      <Townhouses />

      {/* 連絡橋（背景の建物どうし） */}
      <SkyBridge from={[14, 4.5, -16]} to={[18, 5.0, 8]} />
      <SkyBridge from={[-15, 4.0, -14]} to={[-18, 4.5, 10]} />

      {/* 屋台 */}
      <Yatai position={[-4.5, 0, 9.2]} cloth="#c84a3a" sign="ら" />
      <Yatai position={[4.5, 0, 9.2]} cloth="#3a6a8a" sign="茶" />
      <Yatai position={[-7.5, 0, 11]} cloth="#e6a838" sign="酒" />

      {/* 大量の吊り看板（カラフルな箱看板） */}
      <BoxSigns />

      {/* 垂れる蔓（多め） */}
      <HangingVines />
    </group>
  );
}

/* ========== ドーム屋根の 円筒塔 ========== */
function DomeTower({
  position,
  radius,
  height,
  domeColor = "#4a8a78",
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  domeColor?: string;
}) {
  const winMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  const windowMap = useMemo(() => makeTowerWindowTex(radius, height), [radius, height]);

  useFrame(() => {
    if (!winMatRef.current) return;
    const tp = getTimePalette(virtualDate ?? new Date());
    const target = 0.2 + tp.lampIntensity * 1.4;
    winMatRef.current.emissiveIntensity +=
      (target - winMatRef.current.emissiveIntensity) * 0.04;
  });

  return (
    <group position={position}>
      {/* 基壇 */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.15, radius * 1.25, 0.6, 24]} />
        <meshStandardMaterial color="#6a4a30" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* 円筒の本体 */}
      <mesh position={[0, height / 2 + 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.05, height, 24]} />
        <meshStandardMaterial color="#dccfb0" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* 縦のラインのアクセント */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * radius * 1.005, height / 2 + 0.6, Math.sin(a) * radius * 1.005]}
            rotation={[0, -a, 0]}
            castShadow
          >
            <boxGeometry args={[0.06, height, 0.06]} />
            <meshStandardMaterial color="#5a3a20" roughness={0.7} />
          </mesh>
        );
      })}

      {/* 円筒に巻く 窓帯 */}
      <mesh position={[0, height * 0.6 + 0.6, 0]}>
        <cylinderGeometry args={[radius * 1.001, radius * 1.001, height * 0.18, 24, 1, true]} />
        <meshStandardMaterial
          ref={winMatRef}
          map={windowMap}
          emissiveMap={windowMap}
          emissive="#fff4d8"
          emissiveIntensity={0.4}
          color="#3a3030"
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ドーム屋根（半球＋玉ねぎ風） */}
      <mesh position={[0, height + 0.6 + radius * 0.55, 0]} castShadow>
        <sphereGeometry args={[radius * 1.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={domeColor} roughness={0.55} metalness={0.35} />
      </mesh>

      {/* ドームの縁（庇） */}
      <mesh position={[0, height + 0.6, 0]} castShadow>
        <torusGeometry args={[radius * 1.15, 0.12, 12, 32]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* 頂上の 旗竿 + 球体 */}
      <mesh position={[0, height + 0.6 + radius * 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>
      <mesh position={[0, height + 0.6 + radius * 1.55, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#d4a574" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* ドームに登る 装飾の縦リブ */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(a) * radius * 0.7,
              height + 0.6 + radius * 0.3,
              Math.sin(a) * radius * 0.7,
            ]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.04, radius * 0.5, 0.04]} />
            <meshStandardMaterial color="#2a4a3a" roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

function makeTowerWindowTex(radius: number, height: number): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = Math.max(512, Math.round(radius * 256));
  cnv.height = 128;
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "#3a2818";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  const cols = Math.max(8, Math.round(radius * 12));
  for (let c = 0; c < cols; c++) {
    const x = (cnv.width / cols) * c + 6;
    const w = cnv.width / cols - 12;
    // 上の窓
    ctx.fillStyle = Math.random() > 0.3 ? "#fff4d8" : "#1a1410";
    ctx.fillRect(x, 16, w, 38);
    ctx.strokeStyle = "rgba(40,30,20,0.95)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 16, w, 38);
    // 下の窓
    ctx.fillStyle = Math.random() > 0.3 ? "#fff4d8" : "#1a1410";
    ctx.fillRect(x, 76, w, 38);
    ctx.strokeRect(x, 76, w, 38);
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/* ========== 多層タウンハウス ========== */
function Townhouses() {
  const buildings = useMemo(() => {
    const arr: HouseDef[] = [];
    placeRing(arr, 22, 30, 2.4, 4.5, 2.4, 2.0);
    placeRing(arr, 30, 36, 3.0, 6.5, 3.0, 3.5);
    placeRing(arr, 38, 32, 3.4, 8.5, 3.4, 4.0);
    return arr;
  }, []);
  return (
    <group>
      {buildings.map((b, i) => (
        <Townhouse key={i} {...b} />
      ))}
    </group>
  );
}

type HouseDef = {
  position: [number, number, number];
  size: [number, number, number];
  rotY: number;
  wall: string;
  roof: string;
  accent: string;
  roofType: "kawara" | "thatch" | "tile" | "flat";
  seed: number;
};

function placeRing(
  arr: HouseDef[],
  radius: number,
  count: number,
  wMin: number,
  hMin: number,
  dMin: number,
  hRange: number
) {
  const palette = [
    { wall: "#e6dac4", roof: "#3a4a3a", accent: "#7a3a2a" },
    { wall: "#cfa888", roof: "#4a2a1a", accent: "#7a3a2a" },
    { wall: "#dcc8a4", roof: "#3a3a3a", accent: "#5a3a2a" },
    { wall: "#a8c4b8", roof: "#3a4a3a", accent: "#5a3a2a" },
    { wall: "#bda480", roof: "#5a3a30", accent: "#7a3a2a" },
    { wall: "#d4b08a", roof: "#3a3a3a", accent: "#5a3a2a" },
    { wall: "#c8c4a8", roof: "#5a3a3a", accent: "#7a3a2a" },
    { wall: "#e6c4a4", roof: "#3a5a4a", accent: "#7a3a2a" },
  ];
  const roofTypes: HouseDef["roofType"][] = ["kawara", "kawara", "tile", "thatch", "flat"];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const onRoad = Math.abs(Math.cos(a)) > 0.96 || Math.abs(Math.sin(a)) > 0.96;
    if (onRoad) continue;
    const r = radius + (Math.random() - 0.5) * 2.0;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const w = wMin + Math.random() * 1.4;
    const h = hMin + Math.random() * hRange;
    const d = dMin + Math.random() * 1.2;
    const rotY = Math.atan2(z, x) + Math.PI / 2;
    const p = palette[Math.floor(Math.random() * palette.length)];
    arr.push({
      position: [x, 0, z],
      size: [w, h, d],
      rotY,
      wall: p.wall,
      roof: p.roof,
      accent: p.accent,
      roofType: roofTypes[Math.floor(Math.random() * roofTypes.length)],
      seed: Math.random(),
    });
  }
}

function Townhouse({
  position,
  size,
  rotY,
  wall,
  roof,
  accent,
  roofType,
  seed,
}: HouseDef) {
  const winMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const virtualDate = useStore((s) => s.virtualDate);
  const windowMap = useMemo(() => makeShojiWindow(seed, accent), [seed, accent]);

  useFrame(() => {
    if (!winMatRef.current) return;
    const tp = getTimePalette(virtualDate ?? new Date());
    const target = 0.18 + tp.lampIntensity * 1.4;
    winMatRef.current.emissiveIntensity +=
      (target - winMatRef.current.emissiveIntensity) * 0.04;
  });

  const [w, h, d] = size;
  const floors = Math.max(1, Math.floor(h / 1.8));

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={wall} roughness={0.85} metalness={0.05} />
      </mesh>
      {Array.from({ length: floors }).map((_, f) => (
        <mesh key={f} position={[0, (h / floors) * (f + 1) - 0.04, 0]} castShadow>
          <boxGeometry args={[w + 0.08, 0.1, d + 0.08]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
        </mesh>
      ))}
      {/* バルコニー */}
      {floors >= 2 && (
        <mesh position={[0, h * 0.55, d / 2 + 0.18]} castShadow>
          <boxGeometry args={[w * 0.85, 0.08, 0.4]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
        </mesh>
      )}
      <mesh position={[0, h / 2, d / 2 + 0.001]}>
        <planeGeometry args={[w * 0.85, h * 0.78]} />
        <meshStandardMaterial
          ref={winMatRef}
          map={windowMap}
          emissiveMap={windowMap}
          emissive={new THREE.Color("#fff4d8")}
          emissiveIntensity={0.3}
          roughness={0.5}
          color="#5a4a3a"
        />
      </mesh>
      <mesh position={[0, h / 2, -d / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w * 0.85, h * 0.78]} />
        <meshStandardMaterial
          map={windowMap}
          emissiveMap={windowMap}
          emissive={new THREE.Color("#fff4d8")}
          emissiveIntensity={0.3}
          roughness={0.5}
          color="#5a4a3a"
        />
      </mesh>
      {roofType === "kawara" && (
        <>
          <mesh position={[0, h + 0.45, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <cylinderGeometry args={[0.85, 0.85, w + 0.6, 3, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={roof} roughness={0.55} metalness={0.25} />
          </mesh>
          <mesh position={[0, h + 1.1, 0]} castShadow>
            <boxGeometry args={[w + 0.25, 0.12, 0.2]} />
            <meshStandardMaterial color="#1a1820" roughness={0.5} />
          </mesh>
        </>
      )}
      {roofType === "thatch" && (
        <mesh position={[0, h + 0.55, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <cylinderGeometry args={[1.1, 1.1, w + 0.4, 3, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#5a4a30" roughness={0.95} />
        </mesh>
      )}
      {roofType === "tile" && (
        <>
          <mesh position={[0, h + 0.3, 0]} castShadow>
            <boxGeometry args={[w + 0.2, 0.12, d + 0.5]} />
            <meshStandardMaterial color={roof} roughness={0.55} metalness={0.3} />
          </mesh>
          <mesh position={[0, h + 0.32, d / 2 + 0.3]} castShadow>
            <boxGeometry args={[w + 0.3, 0.06, 0.6]} />
            <meshStandardMaterial color={roof} roughness={0.6} />
          </mesh>
        </>
      )}
      {roofType === "flat" && (
        <>
          <mesh position={[0, h + 0.1, 0]} castShadow>
            <boxGeometry args={[w + 0.1, 0.16, d + 0.1]} />
            <meshStandardMaterial color={roof} roughness={0.6} />
          </mesh>
          {seed > 0.5 && (
            <>
              <mesh position={[0, h + 0.7, 0]} castShadow>
                <boxGeometry args={[w * 0.5, 1.0, d * 0.5]} />
                <meshStandardMaterial color={wall} roughness={0.85} />
              </mesh>
              <mesh position={[0, h + 1.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, w * 0.6, 3, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color={roof} roughness={0.55} />
              </mesh>
            </>
          )}
        </>
      )}
      {/* 入口の暖簾 */}
      <mesh position={[0, 0.7, d / 2 + 0.005]}>
        <planeGeometry args={[w * 0.5, 0.5]} />
        <meshStandardMaterial color={accent} side={THREE.DoubleSide} roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ========== 木造の連絡橋 ========== */
function SkyBridge({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const dir = b.clone().sub(a);
  const len = dir.length();
  const center: [number, number, number] = [
    (a.x + b.x) / 2,
    (a.y + b.y) / 2,
    (a.z + b.z) / 2,
  ];
  const angY = Math.atan2(dir.x, dir.z);
  return (
    <group position={center} rotation={[0, angY, 0]}>
      {/* 床 */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.12, len]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.85} />
      </mesh>
      {/* 手摺 左右 */}
      <mesh position={[0.6, 0.4, 0]} castShadow>
        <boxGeometry args={[0.06, 0.7, len]} />
        <meshStandardMaterial color="#3a2818" roughness={0.8} />
      </mesh>
      <mesh position={[-0.6, 0.4, 0]} castShadow>
        <boxGeometry args={[0.06, 0.7, len]} />
        <meshStandardMaterial color="#3a2818" roughness={0.8} />
      </mesh>
      {/* 縦の柵 */}
      {Array.from({ length: Math.floor(len / 0.6) }).map((_, i) => {
        const z = -len / 2 + 0.3 + i * 0.6;
        return (
          <group key={i}>
            <mesh position={[0.6, 0.2, z]} castShadow>
              <boxGeometry args={[0.04, 0.4, 0.04]} />
              <meshStandardMaterial color="#3a2818" roughness={0.8} />
            </mesh>
            <mesh position={[-0.6, 0.2, z]} castShadow>
              <boxGeometry args={[0.04, 0.4, 0.04]} />
              <meshStandardMaterial color="#3a2818" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ========== 緑の入口アーチ ========== */
function GreenArch({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 左柱（太い緑の木材） */}
      <mesh position={[-2.6, 1.9, 0]} castShadow>
        <boxGeometry args={[0.32, 3.8, 0.32]} />
        <meshStandardMaterial color="#3a5a3a" roughness={0.7} />
      </mesh>
      {/* 右柱 */}
      <mesh position={[2.6, 1.9, 0]} castShadow>
        <boxGeometry args={[0.32, 3.8, 0.32]} />
        <meshStandardMaterial color="#3a5a3a" roughness={0.7} />
      </mesh>
      {/* 上の梁（太い） */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[6.0, 0.4, 0.4]} />
        <meshStandardMaterial color="#2a4a2a" roughness={0.7} />
      </mesh>
      {/* 上の屋根（瓦風） */}
      <mesh position={[0, 4.15, 0]} castShadow>
        <boxGeometry args={[6.4, 0.18, 0.6]} />
        <meshStandardMaterial color="#3a4a3a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* 中央の扁額 */}
      <mesh position={[0, 3.4, 0.15]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshBasicMaterial map={makeKanjiSign("町", "#1a1410", "#d4b870")} transparent />
      </mesh>
      {/* 左右の小看板 */}
      <mesh position={[-1.7, 3.4, 0.15]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshBasicMaterial map={makeKanjiSign("商", "#c84a3a", "#fff4d8")} transparent />
      </mesh>
      <mesh position={[1.7, 3.4, 0.15]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshBasicMaterial map={makeKanjiSign("店", "#c84a3a", "#fff4d8")} transparent />
      </mesh>
      {/* 装飾の蔓を絡める */}
      {[-2.6, 2.6].map((x, i) => (
        <mesh key={i} position={[x, 2.8, 0.2]} castShadow>
          <sphereGeometry args={[0.35, 8, 6]} />
          <meshStandardMaterial color="#5a8a4a" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ========== 屋台 ========== */
function Yatai({
  position,
  cloth,
  sign,
}: {
  position: [number, number, number];
  cloth: string;
  sign: string;
}) {
  const signTex = useMemo(() => makeKanjiSign(sign, "#fff4d8", cloth), [sign, cloth]);
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 1.2]} />
        <meshStandardMaterial color="#5a3a20" roughness={0.8} />
      </mesh>
      {[
        [-0.8, 0, -0.5],
        [0.8, 0, -0.5],
        [-0.8, 0, 0.5],
        [0.8, 0, 0.5],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 0.95, p[2]]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
          <meshStandardMaterial color="#3a2818" />
        </mesh>
      ))}
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[2.0, 0.06, 1.4]} />
        <meshStandardMaterial color={cloth} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.7, 1.4, 0.6]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#f4d4a4" emissive="#f5cf8a" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.7, 1.4, 0.6]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#f4d4a4" emissive="#f5cf8a" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 1.55, 0.71]}>
        <planeGeometry args={[1.4, 0.4]} />
        <meshBasicMaterial map={signTex} transparent />
      </mesh>
      <mesh position={[0, 0.9, 0.5]} castShadow>
        <boxGeometry args={[1.7, 0.06, 0.3]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>
    </group>
  );
}

/* ========== 大量の吊り看板 ========== */
function BoxSigns() {
  const items = useMemo(() => {
    const signs = ["菜", "市", "茶", "湯", "福", "宿", "酒", "麺", "和", "灯", "風", "光", "本", "薬", "湯", "亀", "ら", "店", "蕎", "魚"];
    const colors = ["#c84a3a", "#e6a838", "#3a6a8a", "#5a8a4a", "#a83a5a", "#d4a574", "#3a8a8a"];
    const arr: {
      pos: [number, number, number];
      rot: number;
      text: string;
      color: string;
      shape: "box" | "tall";
    }[] = [];

    // プラザの空中に たくさん 吊る
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 8 + Math.random() * 14;
      // 4方向の道沿いと プラザ内 を 避けすぎないように
      const onRoad = Math.abs(Math.cos(a)) > 0.97 || Math.abs(Math.sin(a)) > 0.97;
      if (onRoad) continue;
      const yJitter = 1.6 + Math.random() * 4.5;
      arr.push({
        pos: [Math.cos(a) * r, yJitter, Math.sin(a) * r],
        rot: Math.atan2(Math.sin(a), Math.cos(a)) + Math.PI / 2,
        text: signs[Math.floor(Math.random() * signs.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.5 ? "box" : "tall",
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {items.map((s, i) => (
        <BoxSign key={i} {...s} index={i} />
      ))}
    </group>
  );
}

function BoxSign({
  pos,
  rot,
  text,
  color,
  shape,
  index,
}: {
  pos: [number, number, number];
  rot: number;
  text: string;
  color: string;
  shape: "box" | "tall";
  index: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  const tex = useMemo(() => makeKanjiSign(text, "#fff4d8", color), [text, color]);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.8 + index) * 0.04;
  });
  const size: [number, number] = shape === "box" ? [0.6, 0.6] : [0.4, 1.0];
  return (
    <group position={pos} rotation={[0, rot, 0]} ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[size[0], size[1], 0.06]} />
        <meshStandardMaterial color={color} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.034]}>
        <planeGeometry args={[size[0] * 0.92, size[1] * 0.9]} />
        <meshBasicMaterial map={tex} transparent />
      </mesh>
      <mesh position={[0, size[1] * 0.5 + 0.5, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1.0, 6]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
    </group>
  );
}

/* ========== 紙提灯の 串 ========== */
function LanternStrings() {
  const lanterns = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string; size: number }[] = [];
    const colors = ["#d44a3a", "#e6a838", "#d44a3a", "#e6a838", "#a83a5a", "#fff8d4"];
    // プラザ上空 環状
    const ringR = 11;
    const count = 24;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      arr.push({
        pos: [Math.cos(a) * ringR, 4.3 + Math.random() * 0.6, Math.sin(a) * ringR],
        color: colors[i % colors.length],
        size: 0.18 + Math.random() * 0.08,
      });
    }
    // 内側の串
    const ringR2 = 6;
    const count2 = 12;
    for (let i = 0; i < count2; i++) {
      const a = (i / count2) * Math.PI * 2;
      arr.push({
        pos: [Math.cos(a) * ringR2, 5.2 + Math.random() * 0.4, Math.sin(a) * ringR2],
        color: colors[i % colors.length],
        size: 0.22 + Math.random() * 0.06,
      });
    }
    return arr;
  }, []);
  return (
    <group>
      {lanterns.map((l, i) => (
        <Lantern key={i} {...l} index={i} />
      ))}
    </group>
  );
}

function Lantern({
  pos,
  color,
  size,
  index,
}: {
  pos: [number, number, number];
  color: string;
  size: number;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.8 + index) * 0.06;
  });
  return (
    <group position={pos} ref={ref}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1.2, 6]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>
      <mesh castShadow>
        <sphereGeometry args={[size, 16, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} roughness={0.85} />
      </mesh>
      <mesh position={[0, size, 0]} castShadow>
        <cylinderGeometry args={[size * 0.3, size * 0.3, 0.04, 12]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      <mesh position={[0, -size, 0]}>
        <cylinderGeometry args={[size * 0.3, size * 0.3, 0.04, 12]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
    </group>
  );
}

/* ========== 垂れる蔓（多め） ========== */
function HangingVines() {
  const vines = useMemo(() => {
    const arr: { pos: [number, number, number]; len: number }[] = [];
    for (let i = 0; i < 36; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 12 + Math.random() * 12;
      arr.push({
        pos: [Math.cos(a) * r, 5 + Math.random() * 5, Math.sin(a) * r],
        len: 1.8 + Math.random() * 2.5,
      });
    }
    return arr;
  }, []);
  return (
    <group>
      {vines.map((v, i) => (
        <Vine key={i} {...v} index={i} />
      ))}
    </group>
  );
}

function Vine({
  pos,
  len,
  index,
}: {
  pos: [number, number, number];
  len: number;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.5 + index) * 0.04;
  });
  return (
    <group position={pos} ref={ref}>
      <mesh position={[0, -len / 2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.02, len, 6]} />
        <meshStandardMaterial color="#3a5a3a" roughness={0.85} />
      </mesh>
      {Array.from({ length: 7 }).map((_, k) => (
        <mesh
          key={k}
          position={[(Math.random() - 0.5) * 0.25, -len * (0.15 + k * 0.13), 0]}
          rotation={[0, 0, Math.random() * Math.PI]}
          castShadow
        >
          <sphereGeometry args={[0.16, 6, 4]} />
          <meshStandardMaterial color="#5a8a4a" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ========== 障子風 窓テクスチャ ========== */
function makeShojiWindow(seed: number, accent: string): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = 256;
  cnv.height = 384;
  const ctx = cnv.getContext("2d")!;
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(0, 0, 256, 384);
  const cols = 3;
  const rows = Math.max(2, Math.floor(2 + seed * 4));
  const pad = 14;
  const cellW = (256 - pad * (cols + 1)) / cols;
  const cellH = (384 - pad * (rows + 1)) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * (cellW + pad);
      const y = pad + r * (cellH + pad);
      const on = Math.random() > 0.4;
      ctx.fillStyle = on ? "#fff4d8" : "#1a1410";
      ctx.fillRect(x, y, cellW, cellH);
      if (on) {
        const grd = ctx.createRadialGradient(
          x + cellW / 2, y + cellH / 2, 4,
          x + cellW / 2, y + cellH / 2, cellW * 0.7
        );
        grd.addColorStop(0, "rgba(255,244,216,0)");
        grd.addColorStop(1, accent + "55");
        ctx.fillStyle = grd;
        ctx.fillRect(x, y, cellW, cellH);
      }
      ctx.strokeStyle = "rgba(40,30,20,0.95)";
      ctx.lineWidth = 2;
      const gridX = 3, gridY = 4;
      for (let gx = 1; gx < gridX; gx++) {
        const px = x + (cellW / gridX) * gx;
        ctx.beginPath();
        ctx.moveTo(px, y);
        ctx.lineTo(px, y + cellH);
        ctx.stroke();
      }
      for (let gy = 1; gy < gridY; gy++) {
        const py = y + (cellH / gridY) * gy;
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x + cellW, py);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(30,20,10,1)";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, cellW, cellH);
    }
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ========== 漢字看板 テクスチャ ========== */
function makeKanjiSign(text: string, bg: string, border?: string): THREE.CanvasTexture {
  const cnv = document.createElement("canvas");
  cnv.width = 512;
  cnv.height = 256;
  const ctx = cnv.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 256);
  ctx.fillStyle = bg.startsWith("#") ? bg : "#3a2818";
  ctx.fillRect(0, 0, 512, 256);
  if (border) {
    ctx.fillStyle = border;
    ctx.fillRect(0, 0, 512, 16);
    ctx.fillRect(0, 240, 512, 16);
    ctx.fillRect(0, 0, 16, 256);
    ctx.fillRect(496, 0, 16, 256);
  }
  const isDark = isDarkColor(bg);
  ctx.fillStyle = isDark ? "#fff4d8" : "#2a1810";
  const fontSize = text.length === 1 ? 200 : 90;
  ctx.font = `700 ${fontSize}px 'Hiragino Mincho ProN', 'Yu Mincho', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 128);
  const tex = new THREE.CanvasTexture(cnv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function isDarkColor(hex: string): boolean {
  if (!hex.startsWith("#") || hex.length < 7) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  return lum < 0.5;
}
