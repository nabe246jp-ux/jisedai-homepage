"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Ground from "./Ground";
import Buildings from "./Buildings";
import Fountain from "./Fountain";
import SeasonalParticles from "./SeasonalParticles";
import Crowd from "./Crowd";
import Clouds from "./Clouds";
import JapaneseTown from "./JapaneseTown";
import Roads from "./Roads";
import { useStore } from "@/lib/store";

/**
 * 街のライティング。仮想時計と連動して昼夜が切り替わる。
 *  昼: 強めの太陽光 + 明るいアンビエント
 *  夜: 弱い月光 + 暗めのアンビエント（青みがかった色）
 *  朝夕は中間色
 */
export default function Town() {
  const sunRef = useRef<THREE.DirectionalLight>(null!);
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const hemiRef = useRef<THREE.HemisphereLight>(null!);
  const fillRef = useRef<THREE.DirectionalLight>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  useFrame(() => {
    const now = virtualDate ?? new Date();
    const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

    // 昼夜の指標 (0 = 真昼, 1 = 真夜中)
    let nightFactor: number;
    if (h >= 7 && h <= 17) nightFactor = 0;
    else if (h >= 22 || h < 4) nightFactor = 1;
    else if (h > 17 && h < 22) nightFactor = (h - 17) / 5;
    else nightFactor = 1 - (h - 4) / 3;
    nightFactor = Math.max(0, Math.min(1, nightFactor));

    // 太陽の位置・強度・色
    if (sunRef.current) {
      const ang = ((h - 6) / 12) * Math.PI;
      const r = 25;
      sunRef.current.position.x = -Math.cos(ang) * r;
      sunRef.current.position.y = Math.max(2, Math.sin(ang) * r);
      sunRef.current.position.z = -8;

      // 太陽の色を昼→夕焼け→月光に
      const dayColor = new THREE.Color("#fff5d8");
      const duskColor = new THREE.Color("#ffb070");
      const nightColor = new THREE.Color("#7a8aa8");
      const duskWeight = Math.sin(nightFactor * Math.PI);
      const target = dayColor.clone().lerp(nightColor, nightFactor).lerp(duskColor, duskWeight * 0.4);
      sunRef.current.color.lerp(target, 0.05);

      // 強度は昼に強く、夜に弱く
      const targetIntensity = 2.4 * (1 - nightFactor) + 0.35 * nightFactor;
      sunRef.current.intensity += (targetIntensity - sunRef.current.intensity) * 0.05;
    }

    // アンビエントライト
    if (ambientRef.current) {
      const dayCol = new THREE.Color("#fce8c8");
      const nightCol = new THREE.Color("#3a4870");
      const target = dayCol.clone().lerp(nightCol, nightFactor);
      ambientRef.current.color.lerp(target, 0.05);
      const targetIntensity = 1.1 * (1 - nightFactor) + 0.45 * nightFactor;
      ambientRef.current.intensity +=
        (targetIntensity - ambientRef.current.intensity) * 0.05;
    }

    // ヘミスフィアライト（空からの光）
    if (hemiRef.current) {
      const skyDay = new THREE.Color("#cfe6f5");
      const skyNight = new THREE.Color("#1a2050");
      const target = skyDay.clone().lerp(skyNight, nightFactor);
      hemiRef.current.color.lerp(target, 0.05);
      hemiRef.current.groundColor.lerp(new THREE.Color("#5a8a5a"), 0.05);
      const targetIntensity = 0.9 * (1 - nightFactor) + 0.4 * nightFactor;
      hemiRef.current.intensity += (targetIntensity - hemiRef.current.intensity) * 0.05;
    }

    // 反対側のフィルライト
    if (fillRef.current) {
      const target = 0.5 * (1 - nightFactor) + 0.15 * nightFactor;
      fillRef.current.intensity += (target - fillRef.current.intensity) * 0.05;
    }
  });

  return (
    <group>
      <ambientLight ref={ambientRef} intensity={1.1} color="#fce8c8" />
      <hemisphereLight ref={hemiRef} args={["#cfe6f5", "#5a8a5a", 0.9]} />
      <directionalLight
        ref={sunRef}
        position={[8, 22, -6]}
        intensity={2.4}
        color="#fff5d8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0003}
      />
      <directionalLight
        ref={fillRef}
        position={[-12, 10, 14]}
        intensity={0.5}
        color="#a4d4f5"
      />

      <Ground />
      <Roads />
      <Buildings />
      <Fountain position={[0, 0, 0]} />
      <JapaneseTown />
      <Crowd />
      <Clouds />
      <SeasonalParticles />
    </group>
  );
}
