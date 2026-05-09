"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useStore, type BuildingKey } from "@/lib/store";

/**
 * カメラ制御。
 *  - 通常時: 街全体をふんわり眺める。マウスでゆるやかに揺れる。
 *  - マウスホイール: 視点の高さ（仰角）を上下できる。
 *      ホイールを下に回す → 低い位置から見上げる視点（街を下から眺める）
 *      ホイールを上に回す → 高い位置から見下ろす視点（鳥の目線）
 *  - selectedBuilding がセットされたら: その建物に寄って正面から見下ろす位置に。
 *  - ESC で街全体に戻る。
 */

const ZOOM_VIEWS: Record<BuildingKey, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
  training: {
    pos: new THREE.Vector3(-7, 5.0, 4.0),
    look: new THREE.Vector3(-7, 2.5, -5),
  },
  business: {
    pos: new THREE.Vector3(7, 5.5, 4.0),
    look: new THREE.Vector3(7, 3.0, -5),
  },
  welfare: {
    pos: new THREE.Vector3(-7, 5.0, 14.0),
    look: new THREE.Vector3(-7, 2.2, 5),
  },
  company: {
    pos: new THREE.Vector3(7, 5.0, 14.0),
    look: new THREE.Vector3(7, 2.5, 5),
  },
};

export default function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 1.5, 0));
  const desired = useRef(new THREE.Vector3(0, 9, 26));
  const { camera, mouse, clock } = useThree();
  const selected = useStore((s) => s.selectedBuilding);
  const setSelected = useStore((s) => s.setSelectedBuilding);

  // ホイール操作で「視点の高さ」を表す値。
  //  yOffset:    -8 (低い位置・下から見上げる)  〜  +14 (高い位置・見下ろす)
  //  zOffset:    視点の高さに応じてカメラを少し前後に動かす
  //  lookYOffset:カメラが見る点の高さ。下から見上げる時は target を高めに。
  const yOffset = useRef(0);

  // ESC で建物選択解除
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selected) {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, setSelected]);

  // ホイールで視点の高さを変える
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // 建物にズーム中はホイール無効（誤操作防止）
      if (useStore.getState().selectedBuilding) return;
      // ホイールを下に回すと yOffset が下がる（=下からの視点）
      yOffset.current -= e.deltaY * 0.012;
      yOffset.current = Math.max(-8, Math.min(14, yOffset.current));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useFrame(() => {
    const t = clock.getElapsedTime();

    if (selected) {
      const view = ZOOM_VIEWS[selected];
      const mx = mouse.x * 0.5;
      const my = mouse.y * 0.3;
      desired.current.set(view.pos.x + mx, view.pos.y + my, view.pos.z);
      target.current.lerp(view.look, 0.08);
      camera.position.lerp(desired.current, 0.06);
    } else {
      const sx = Math.sin(t * 0.06) * 1.5;
      const sy = Math.cos(t * 0.04) * 0.5;
      const mx = mouse.x * 1.8;
      const my = mouse.y * 1.0;

      // ホイール量を 0..1 (-1..0..+1) に正規化
      const yo = yOffset.current;

      // カメラ高さ: ベース 9 + ホイール offset
      const camY = 9 + sy + my + yo;
      // 距離: 低い視点ほど少し近づく（街並みを真横から見るため）
      const camZ = 26 - Math.max(0, -yo) * 0.7;
      desired.current.set(0 + sx + mx, camY, camZ);

      // ターゲット: 下からの視点では高めの点を、上からの視点では地面寄りを見る
      // yo が負（下から）→ ターゲット y を高く（建物上部寄りを見上げる）
      // yo が正（上から）→ ターゲット y を低く（地面寄りを見下ろす）
      const targetY = 1.5 + Math.max(0, -yo) * 0.6 - Math.max(0, yo) * 0.05;
      target.current.lerp(new THREE.Vector3(0, targetY, 0), 0.06);
      camera.position.lerp(desired.current, 0.04);
    }
    camera.lookAt(target.current);
  });

  return null;
}
