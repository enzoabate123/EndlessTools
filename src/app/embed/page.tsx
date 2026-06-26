"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Grid } from "@react-three/drei";
import ToolRenderer from "@/components/ToolRenderer";
import { useToolStore } from "@/store/useToolStore";
import { levaStore } from "leva";
import { useSearchParams } from "next/navigation";

function EmbedContent() {
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const stateParam = searchParams.get("state");

  useEffect(() => {
    if (stateParam) {
      try {
        const decoded = JSON.parse(atob(stateParam));

        // 1. Inject useToolStore
        if (decoded.toolStore) {
          useToolStore.setState({
            activeGeometry: decoded.toolStore.activeGeometry,
            activeMaterial: decoded.toolStore.activeMaterial,
            activeFilters: decoded.toolStore.activeFilters || [],
          });
        }

        // 2. Inject Leva values
        if (decoded.levaStore) {
          const formattedLevaData: Record<string, unknown> = {};
          for (const key in decoded.levaStore) {
             formattedLevaData[key] = { value: decoded.levaStore[key] };
          }
          // use addData to inject the settings
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          levaStore.addData(formattedLevaData as any, false);
        }
      } catch (err) {
        console.error("Failed to parse embed state", err);
      }
    }

    // Slight delay to ensure state is injected before rendering canvas components
    setTimeout(() => setIsReady(true), 50);
  }, [stateParam]);

  if (!isReady) return <div className="w-full h-full bg-[#0a0a0a]" />;

  return (
    <main className="flex h-screen w-screen bg-[#0a0a0a] text-white">
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            <ToolRenderer />

            <OrbitControls makeDefault autoRotate autoRotateSpeed={1} />
            <Grid
              infiniteGrid
              fadeDistance={20}
              sectionColor="#333"
              cellColor="#111"
              position={[0, -1.5, 0]}
            />
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="w-full h-full bg-[#0a0a0a]" />}>
      <EmbedContent />
    </Suspense>
  );
}
