"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { getInterpolatedSeason } from "@/lib/seasons";
import { getTimePalette } from "@/lib/timeOfDay";

/**
 * 巨大な球体の内側にグラデーションを描いた空ドーム。
 * 季節色 + 時刻色を ShaderMaterial でブレンドする。
 */
export default function SkyDome() {
  const ref = useRef<THREE.Mesh>(null!);
  const virtualDate = useStore((s) => s.virtualDate);
  const { scene } = useThree();

  const uniforms = useMemo(
    () => ({
      uSkyTop: { value: new THREE.Color("#1a2855") },
      uSkyBottom: { value: new THREE.Color("#f0c898") },
      uOverlayTop: { value: new THREE.Color("#0a0a1a") },
      uOverlayBottom: { value: new THREE.Color("#1a1230") },
      uOverlayStrength: { value: 0.5 },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const now = virtualDate ?? new Date();
    const season = getInterpolatedSeason(now);
    const time = getTimePalette(now);

    const lerp = 0.04;
    uniforms.uSkyTop.value.lerp(new THREE.Color(season.skyTop), lerp);
    uniforms.uSkyBottom.value.lerp(new THREE.Color(season.skyBottom), lerp);
    uniforms.uOverlayTop.value.lerp(new THREE.Color(time.skyOverlay), lerp);
    uniforms.uOverlayBottom.value.lerp(new THREE.Color(time.horizonOverlay), lerp);
    uniforms.uOverlayStrength.value +=
      (time.overlayStrength - uniforms.uOverlayStrength.value) * lerp;
    uniforms.uTime.value = state.clock.getElapsedTime();

    // 霧も連動
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2("#1a1830", season.fog * 0.04);
    } else {
      const fog = scene.fog as THREE.FogExp2;
      fog.density += (season.fog * 0.04 - fog.density) * 0.02;
      // 霧の色は地平線色とブレンド
      const fogColor = new THREE.Color(season.skyBottom).lerp(
        new THREE.Color(time.horizonOverlay),
        time.overlayStrength * 0.7
      );
      fog.color.lerp(fogColor, 0.04);
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
          uniform vec3 uOverlayTop;
          uniform vec3 uOverlayBottom;
          uniform float uOverlayStrength;
          uniform float uTime;

          void main() {
            float h = clamp((vWorldPos.y / 80.0) * 0.7 + 0.4, 0.0, 1.0);
            vec3 base = mix(uSkyBottom, uSkyTop, smoothstep(0.0, 1.0, h));
            vec3 overlay = mix(uOverlayBottom, uOverlayTop, smoothstep(0.0, 1.0, h));
            vec3 col = mix(base, overlay, uOverlayStrength);

            // 微細な縦方向のグラデーションでバンディング軽減
            float dither = (fract(sin(dot(vWorldPos.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
            col += dither;

            // 星のきらめき（夜だけうっすら出す）
            if (uOverlayStrength > 0.6 && h > 0.4) {
              vec2 g = floor(vWorldPos.xz * 1.5);
              float r = fract(sin(dot(g, vec2(91.345, 47.853))) * 43758.5453);
              if (r > 0.997) {
                float twinkle = 0.5 + 0.5 * sin(uTime * 2.0 + r * 6.28);
                col += vec3(0.9, 0.95, 1.0) * twinkle * (uOverlayStrength - 0.6) * 1.5;
              }
            }

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}
