"use client";

import { useRef } from "react";
import * as THREE from "three";
import Ground from "./Ground";
import Buildings from "./Buildings";
import Trees from "./Trees";
import SeasonalParticles from "./SeasonalParticles";
import Crowd from "./Crowd";
import Clouds from "./Clouds";
import JapaneseTown from "./JapaneseTown";
import Roads from "./Roads";

/**
 * 常に日中の明るい街。空は青空に固定。
 * 太陽は南中近く、空気感は爽やかな初夏のイメージ。
 */
export default function Town() {
  const sunRef = useRef<THREE.DirectionalLight>(null!);
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const hemiRef = useRef<THREE.HemisphereLight>(null!);
  const fillRef = useRef<THREE.DirectionalLight>(null!);

  return (
    <group>
      <ambientLight ref={ambientRef} intensity={1.1} color="#fce8c8" />
      <hemisphereLight ref={hemiRef} args={["#fff4d8", "#5a8a5a", 0.85]} />
      <directionalLight
        ref={sunRef}
        position={[8, 18, -8]}
        intensity={2.2}
        color="#ffe6b8"
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
        intensity={0.45}
        color="#aacfee"
      />

      <Ground />
      <Roads />
      <Buildings />
      <JapaneseTown />
      <Trees />
      <Crowd />
      <Clouds />
      <SeasonalParticles />
    </group>
  );
}
