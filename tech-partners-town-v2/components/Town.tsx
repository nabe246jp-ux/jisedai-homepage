"use client";

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
  return (
    <group>
      <ambientLight intensity={1.1} color="#fce8c8" />
      <hemisphereLight args={["#cfe6f5", "#5a8a5a", 0.9]} />
      <directionalLight
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
        position={[-12, 10, 14]}
        intensity={0.5}
        color="#a4d4f5"
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
