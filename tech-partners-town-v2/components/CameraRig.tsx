"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useStore, type BuildingKey } from "@/lib/store";

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selected) {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, setSelected]);

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

      desired.current.set(0 + sx + mx, 9 + sy + my, 26);
      target.current.lerp(new THREE.Vector3(0, 1.5, 0), 0.06);
      camera.position.lerp(desired.current, 0.04);
    }
    camera.lookAt(target.current);
  });

  return null;
}
