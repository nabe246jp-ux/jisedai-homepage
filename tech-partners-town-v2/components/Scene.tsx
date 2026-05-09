"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";
import Town from "./Town";
import SkyDome from "./SkyDome";
import CameraRig from "./CameraRig";
import * as THREE from "three";

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.45,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ position: [0, 9, 26], fov: 42, near: 0.1, far: 220 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Environment preset="park" background={false} environmentIntensity={1.0} />

        <SkyDome />

        <Town />

        <CameraRig />

        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.78}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.32} darkness={0.32} />
        </EffectComposer>

        <Preload all />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Suspense>
    </Canvas>
  );
}
