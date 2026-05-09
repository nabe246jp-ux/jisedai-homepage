"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import MascotBot from "@/components/MascotBot";
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import HeaderBar from "@/components/HeaderBar";
import DemoControls from "@/components/DemoControls";
import BuildingDetail from "@/components/BuildingDetail";
import { useStore } from "@/lib/store";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Home() {
  const setVirtualDate = useStore((s) => s.setVirtualDate);

  // 朝スタート + 仮想時計を 100ms ごとに進める
  useEffect(() => {
    const morning = new Date();
    morning.setHours(8, 30, 0, 0);
    setVirtualDate(morning);

    const id = setInterval(() => {
      const cur = useStore.getState().virtualDate;
      if (!cur) return;
      setVirtualDate(new Date(cur.getTime() + 100));
    }, 100);
    return () => clearInterval(id);
  }, [setVirtualDate]);

  return (
    <main className="fixed inset-0 overflow-hidden">
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>

      <HeaderBar />
      <MascotBot />
      <DemoControls />

      <div className="vignette" />
      <div className="film-grain" />

      <BuildingDetail />

      <CustomCursor />
    </main>
  );
}
