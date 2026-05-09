"use client";

import { Cloud, Clouds as DreiClouds } from "@react-three/drei";
import * as THREE from "three";

/**
 * dreiの雲。少しだけ配置して空を「動いている」感じにする。
 * 重さを抑えるため数は控えめ。
 */
export default function Clouds() {
  return (
    <DreiClouds material={THREE.MeshLambertMaterial}>
      <Cloud
        seed={1}
        position={[-12, 14, -8]}
        bounds={[8, 2, 4]}
        volume={6}
        color="#fef3df"
        opacity={0.55}
        fade={40}
      />
      <Cloud
        seed={2}
        position={[10, 16, -10]}
        bounds={[10, 2, 5]}
        volume={7}
        color="#f5d6e0"
        opacity={0.5}
        fade={40}
      />
      <Cloud
        seed={3}
        position={[0, 18, -16]}
        bounds={[12, 2, 4]}
        volume={8}
        color="#e0d4ec"
        opacity={0.45}
        fade={40}
      />
    </DreiClouds>
  );
}
