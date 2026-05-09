"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import KPIBoard from "@/components/KPIBoard";
import LiveTime from "@/components/LiveTime";
import MascotBot from "@/components/MascotBot";
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import HeaderBar from "@/components/HeaderBar";
import DemoControls from "@/components/DemoControls";
import BuildingDetail from "@/components/BuildingDetail";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden">
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>

      <HeaderBar />
      <LiveTime />
      <KPIBoard />
      <MascotBot />
      <DemoControls />

      <div className="vignette" />
      <div className="film-grain" />

      <BuildingDetail />

      <CustomCursor />
    </main>
  );
}
