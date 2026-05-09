"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * 常に明るい青空。時間帯・季節の影響は受けない。
 * 上空は深めの青、地平線は淡い水色のグラデーション。
 */
export default function SkyDome() {
  const ref = useRef<THREE.Mesh>(null!);
  const { scene } = useThree();

  const uniforms = useMemo(
    () => ({
      uSkyTop: { value: new THREE.Color("#3a82c8") },
      uSkyBottom: { value: new THREE.Color("#cfe6f5") },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();

    // 霧は薄く、地平線色に合わせる（遠くがふわっと馴染む程度）
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2("#cfe6f5", 0.008);
    } else {
      const fog = scene.fog as THREE.FogExp2;
      fog.density += (0.008 - fog.density) * 0.05;
      fog.color.lerp(new THREE.Color("#cfe6f5"), 0.05);
    }
  });

  return (
    <mesh ref={ref} scale={[80, 80, 80]}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={`
          varying vec3 vWorldPos;
          uniform vec3 uSkyTop;
          uniform vec3 uSkyBottom;
          uniform float uTime;

          void main() {
            float h = clamp((vWorldPos.y / 80.0) * 0.7 + 0.4, 0.0, 1.0);
            vec3 col = mix(uSkyBottom, uSkyTop, smoothstep(0.0, 1.0, h));

            // 微細なノイズでバンディング軽減
            float dither = (fract(sin(dot(vWorldPos.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
            col += dither;

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}
