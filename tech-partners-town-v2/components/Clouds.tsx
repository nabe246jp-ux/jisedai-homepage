"use client";

import { Cloud, Clouds as DreiClouds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * 青空にふわっと浮かぶ白い雲群。
 * グループ全体をゆっくり横移動させて、雲が流れていく感じを出す。
 */
export default function Clouds() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // ゆっくり右から左に流れる
    groupRef.current.position.x -= delta * 0.25;
    // 範囲を超えたらループ
    if (groupRef.current.position.x < -30) {
      groupRef.current.position.x = 30;
    }
  });

  return (
    <group ref={groupRef}>
      <DreiClouds material={THREE.MeshLambertMaterial}>
        {/* 大きな白い積雲を散らす */}
        <Cloud
          seed={1}
          position={[-14, 16, -12]}
          bounds={[10, 2.5, 5]}
          volume={8}
          color="#ffffff"
          opacity={0.85}
          fade={35}
          speed={0.1}
        />
        <Cloud
          seed={2}
          position={[10, 18, -14]}
          bounds={[12, 3, 6]}
          volume={10}
          color="#ffffff"
          opacity={0.8}
          fade={35}
          speed={0.1}
        />
        <Cloud
          seed={3}
          position={[0, 20, -18]}
          bounds={[14, 2.5, 5]}
          volume={11}
          color="#ffffff"
          opacity={0.8}
          fade={35}
          speed={0.1}
        />
        <Cloud
          seed={4}
          position={[18, 17, 6]}
          bounds={[10, 2, 4]}
          volume={7}
          color="#ffffff"
          opacity={0.75}
          fade={35}
          speed={0.1}
        />
        <Cloud
          seed={5}
          position={[-18, 19, 4]}
          bounds={[10, 2, 4]}
          volume={7}
          color="#ffffff"
          opacity={0.75}
          fade={35}
          speed={0.1}
        />
        <Cloud
          seed={6}
          position={[-6, 22, 14]}
          bounds={[8, 2, 3]}
          volume={6}
          color="#ffffff"
          opacity={0.7}
          fade={35}
          speed={0.1}
        />
        <Cloud
          seed={7}
          position={[8, 21, 16]}
          bounds={[9, 2, 4]}
          volume={6}
          color="#ffffff"
          opacity={0.7}
          fade={35}
          speed={0.1}
        />
      </DreiClouds>
    </group>
  );
}
