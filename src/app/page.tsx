"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Grid, SoftShadows } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { Leva, useControls } from "leva";
import { Settings, Layers, Download } from "lucide-react";
import ToolsSidebar from "@/components/ToolsSidebar";
import ToolRenderer from "@/components/ToolRenderer";
import { useToolStore } from "@/store/useToolStore";

export default function Home() {
  const { activeSidebarTab } = useToolStore();

  const { lightX, lightY, contrast, focalLength, aperture } = useControls('Lighting Studio', {
    lightX: { value: 10, min: -20, max: 20 },
    lightY: { value: 10, min: -20, max: 20 },
    contrast: { value: 1.5, min: 0.1, max: 5 },
    focalLength: { value: 0.02, min: 0.0, max: 0.1 },
    aperture: { value: 2.0, min: 0.0, max: 10.0 }
  });

  return (
    <main className="flex h-screen w-screen bg-[#0a0a0a] text-white">
      {/* Sidebar for Navigation / Tool Selection */}
      <ToolsSidebar />

      {/* Main Viewport */}
      <div className="flex-1 relative flex flex-col">
        {/* Top Header / Export Bar */}
        <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-[#1a1a1a] px-4 py-2 rounded-full ring-1 ring-white/10">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium capitalize">{activeSidebarTab?.replace("-", " ") || "Select a Tool"}</span>
          </div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
             <button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] p-2 rounded-full ring-1 ring-white/10 transition">
              <Settings className="w-4 h-4" />
            </button>
            <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </header>

        {/* 3D Canvas */}
        <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas shadows
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <Environment preset="city" />
              <SoftShadows size={25} samples={10} focus={0.5} />
              <ambientLight intensity={0.5 / contrast} />
              <directionalLight
                castShadow
                position={[lightX, lightY, 5]}
                intensity={1 * contrast}
                shadow-mapSize={[2048, 2048]}
              >
                <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 1, 50]} />
              </directionalLight>
              
              <ToolRenderer />
              
              <OrbitControls makeDefault />
              <Grid 
                infiniteGrid 
                fadeDistance={20} 
                sectionColor="#333" 
                cellColor="#111" 
                position={[0, -1.5, 0]} 
              />
              <EffectComposer>
                <DepthOfField focusDistance={0} focalLength={focalLength} bokehScale={aperture} height={480} />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Right Sidebar for Leva Controls */}
      <div className="w-[300px] border-l border-white/10 bg-[#0f0f0f] relative z-20">
         <Leva 
            fill 
            titleBar={{ title: 'Properties' }} 
            theme={{ colors: { elevation1: 'transparent', elevation2: 'transparent' } }}
            flat
          />
      </div>
    </main>
  );
}
