"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";

/**
 * 昼夜で切り替わる空。
 *  昼: 明るい青空のグラデーション + 太陽（球体メッシュ）+ 雲（別コンポーネント）
 *  夜: 深い紺の星空 + 瞬く星
 *  朝夕: 上記が滑らかに混ざる
 *
 * 仮想時計（virtualDate）と連動し、Town.tsx 側のライティングも別途連動する。
 */
export default function SkyDome() {
  const ref = useRef<THREE.Mesh>(null!);
  const sunRef = useRef<THREE.Mesh>(null!);
  const sunGlowRef = useRef<THREE.Mesh>(null!);
  const moonRef = useRef<THREE.Mesh>(null!);
  const virtualDate = useStore((s) => s.virtualDate);
  const { scene } = useThree();

  const uniforms = useMemo(
    () => ({
      uSkyTop: { value: new THREE.Color("#3a82c8") },
      uSkyBottom: { value: new THREE.Color("#cfe6f5") },
      uNightFactor: { value: 0 }, // 0 = 完全な昼, 1 = 完全な夜
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const now = virtualDate ?? new Date();
    const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

    // 昼夜の指標 (0 = 真昼, 1 = 真夜中)
    // 6時で 0、12時で 0、18時で 0、22時〜4時で 1
    let nightFactor: number;
    if (h >= 7 && h <= 17) {
      // 完全な昼
      nightFactor = 0;
    } else if (h >= 22 || h < 4) {
      // 完全な夜
      nightFactor = 1;
    } else if (h > 17 && h < 22) {
      // 夕方→夜 (17〜22の間で 0→1)
      nightFactor = (h - 17) / 5;
    } else {
      // 夜明け (4〜7の間で 1→0)
      nightFactor = 1 - (h - 4) / 3;
    }
    nightFactor = Math.max(0, Math.min(1, nightFactor));

    // 昼の色
    const dayTop = new THREE.Color("#3a82c8");
    const dayBottom = new THREE.Color("#cfe6f5");
    // 夕焼けの色（夜に向かう途中で混ぜる）
    const duskTop = new THREE.Color("#3a3a78");
    const duskBottom = new THREE.Color("#f5a06a");
    // 夜の色
    const nightTop = new THREE.Color("#050822");
    const nightBottom = new THREE.Color("#1a1838");

    // 夜への遷移を 2段階で：昼→夕焼け→夜
    const duskWeight = Math.sin(nightFactor * Math.PI); // 中間で最大
    let targetTop = dayTop.clone().lerp(nightTop, nightFactor);
    let targetBottom = dayBottom.clone().lerp(nightBottom, nightFactor);
    targetTop.lerp(duskTop, duskWeight * 0.45);
    targetBottom.lerp(duskBottom, duskWeight * 0.55);

    uniforms.uSkyTop.value.lerp(targetTop, 0.06);
    uniforms.uSkyBottom.value.lerp(targetBottom, 0.06);
    uniforms.uNightFactor.value += (nightFactor - uniforms.uNightFactor.value) * 0.05;
    uniforms.uTime.value = state.clock.getElapsedTime();

    // 太陽の位置（東→上→西、6時に東、12時に真上、18時に西）
    if (sunRef.current && sunGlowRef.current) {
      const ang = ((h - 6) / 12) * Math.PI; // 0..π
      const r = 60;
      const sx = -Math.cos(ang) * r;
      const sy = Math.sin(ang) * r;
      const sz = -25;
      sunRef.current.position.set(sx, sy, sz);
      sunGlowRef.current.position.set(sx, sy, sz);
      // 昼間だけ表示
      const sunVisible = nightFactor < 0.85;
      sunRef.current.visible = sunVisible;
      sunGlowRef.current.visible = sunVisible;
      // 夜に近づくにつれてフェード
      const opacity = 1 - nightFactor;
      const sunMat = sunRef.current.material as THREE.MeshBasicMaterial;
      const glowMat = sunGlowRef.current.material as THREE.MeshBasicMaterial;
      sunMat.opacity = opacity;
      glowMat.opacity = opacity * 0.4;
    }

    // 月の位置（昼夜逆転、夜に出る）
    if (moonRef.current) {
      const moonAng = ((h - 18) / 12) * Math.PI; // 18時に東、24時に上、6時に西
      const r = 55;
      const mx = -Math.cos(moonAng) * r;
      const my = Math.sin(moonAng) * r;
      const mz = -22;
      moonRef.current.position.set(mx, Math.max(8, my), mz);
      moonRef.current.visible = nightFactor > 0.3;
      const moonMat = moonRef.current.material as THREE.MeshBasicMaterial;
      moonMat.opacity = nightFactor;
    }

    // 霧（昼は薄く水色、夜は濃いめの紺）
    const fogColor = new THREE.Color("#cfe6f5").lerp(new THREE.Color("#1a1838"), nightFactor);
    const fogDensity = 0.006 + nightFactor * 0.012;
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2(fogColor.getHex(), fogDensity);
    } else {
      const fog = scene.fog as THREE.FogExp2;
      fog.density += (fogDensity - fog.density) * 0.05;
      fog.color.lerp(fogColor, 0.05);
    }
  });

  return (
    <group>
      {/* 空のドーム */}
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
            uniform float uNightFactor;
            uniform float uTime;

            // ハッシュ関数（星のランダム配置用）
            float hash(vec2 p) {
              return fract(sin(dot(p, vec2(91.345, 47.853))) * 43758.5453);
            }

            void main() {
              float h = clamp((vWorldPos.y / 80.0) * 0.7 + 0.4, 0.0, 1.0);
              vec3 col = mix(uSkyBottom, uSkyTop, smoothstep(0.0, 1.0, h));

              // 夜だけ星を散らす
              if (uNightFactor > 0.3 && h > 0.25) {
                vec2 g = floor(vWorldPos.xz * 2.5);
                float r = hash(g);
                if (r > 0.992) {
                  float twinkle = 0.5 + 0.5 * sin(uTime * 1.8 + r * 6.28);
                  float starStrength = (uNightFactor - 0.3) / 0.7;
                  col += vec3(0.95, 0.97, 1.0) * twinkle * starStrength * 1.6;
                }
                // もう一段細かい星
                vec2 g2 = floor(vWorldPos.xz * 6.0);
                float r2 = hash(g2 + 100.0);
                if (r2 > 0.997) {
                  float twinkle2 = 0.5 + 0.5 * sin(uTime * 2.6 + r2 * 6.28);
                  float starStrength2 = (uNightFactor - 0.3) / 0.7;
                  col += vec3(0.9, 0.95, 1.0) * twinkle2 * starStrength2 * 1.0;
                }
              }

              // ディザリング
              float dither = (hash(vWorldPos.xy) - 0.5) / 255.0;
              col += dither;

              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>

      {/* 太陽 */}
      <mesh ref={sunRef} position={[20, 40, -25]}>
        <sphereGeometry args={[3, 24, 24]} />
        <meshBasicMaterial color="#fff8d4" transparent opacity={1.0} />
      </mesh>
      {/* 太陽のハロー */}
      <mesh ref={sunGlowRef} position={[20, 40, -25]}>
        <sphereGeometry args={[6, 24, 24]} />
        <meshBasicMaterial color="#ffe6a8" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* 月 */}
      <mesh ref={moonRef} position={[-20, 35, -22]}>
        <sphereGeometry args={[2.4, 24, 24]} />
        <meshBasicMaterial color="#f0eed4" transparent opacity={0} />
      </mesh>
    </group>
  );
}
