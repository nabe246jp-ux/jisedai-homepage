"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Ground from "./Ground";
import Buildings from "./Buildings";
import StreetLamps from "./StreetLamps";
import Trees from "./Trees";
import SeasonalParticles from "./SeasonalParticles";
import Crowd from "./Crowd";
import Clouds from "./Clouds";
import JapaneseTown from "./JapaneseTown";
import Roads from "./Roads";
import { useStore } from "@/lib/store";
import { getInterpolatedSeason } from "@/lib/seasons";
import { getTimePalette } from "@/lib/timeOfDay";

export default function Town() {
  const sunRef = useRef<THREE.DirectionalLight>(null!);
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const hemiRef = useRef<THREE.HemisphereLight>(null!);
  const fillRef = useRef<THREE.DirectionalLight>(null!);
  const virtualDate = useStore((s) => s.virtualDate);

  useFrame(() => {
    const now = virtualDate ?? new Date();
    const season = getInterpolatedSeason(now);
    const time = getTimePalette(now);

    if (sunRef.current) {
      sunRef.current.color.lerp(new THREE.Color(season.sun), 0.05);
      sunRef.current.intensity += (time.sunIntensity - sunRef.current.intensity) * 0.05;
      const h = now.getHours() + now.getMinutes() / 60;
      const ang = ((h - 6) / 12) * Math.PI;
      const r = 25;
      sunRef.current.position.x = -Math.cos(ang) * r;
      sunRef.current.position.y = Math.max(2, Math.sin(ang) * r);
      sunRef.current.position.z = -8;
    }
    if (ambientRef.current) {
      ambientRef.current.color.lerp(new THREE.Color(season.ambient), 0.05);
      ambientRef.current.intensity +=
        (time.ambientIntensity - ambientRef.current.intensity) * 0.05;
    }
    if (hemiRef.current) {
      hemiRef.current.color.lerp(new THREE.Color(season.skyBottom), 0.05);
      hemiRef.current.groundColor.lerp(new THREE.Color(season.ground), 0.05);
      const targetHemi = 0.55 + time.ambientIntensity * 0.4;
      hemiRef.current.intensity += (targetHemi - hemiRef.current.intensity) * 0.05;
    }
    if (fillRef.current) {
      const target = time.ambientIntensity * 0.45;
      fillRef.current.intensity += (target - fillRef.current.intensity) * 0.05;
    }
  });

  return (
    <group>
      <ambientLight ref={ambientRef} intensity={1.0} color="#dde8ee" />
      <hemisphereLight ref={hemiRef} args={["#cfe6ff", "#5a4a3a", 0.85]} />
      <directionalLight
        ref={sunRef}
        position={[8, 18, -8]}
        intensity={2.0}
        color="#fff4d8"
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
      <JapaneseTown />
      <StreetLamps />
      <Trees />
      <Crowd />
      <Clouds />
      <SeasonalParticles />
    </group>
  );
}
