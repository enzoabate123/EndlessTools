"use client";

import { Suspense, lazy, useRef } from "react";
import { useControls } from "leva";
import { useEffect } from "react";
import { Center } from "@react-three/drei";
import { useToolStore } from "@/store/useToolStore";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "@react-three/postprocessing";


// Lazy load Geometry Tools
const ShapeExtrudeTool = lazy(() => import("@/tools/shape-extrude/ShapeExtrudeTool"));
const Typography3DTool = lazy(() => import("@/tools/typography-3d/Typography3DTool"));
const ImportPipelineTool = lazy(() => import("@/tools/import-pipeline/ImportPipelineTool"));
const LegoLandscapeTool = lazy(() => import("@/tools/lego-landscape/LegoLandscapeTool"));

// Lazy load Material/Effect Tools
const LiquidMetalTool = lazy(() => import("@/tools/liquid-metal/LiquidMetalTool"));
const DreamChromeTool = lazy(() => import("@/tools/dream-chrome/DreamChromeTool"));
const PixelWorldTool = lazy(() => import("@/tools/pixel-world/PixelWorldTool"));
const RetroMaterialTool = lazy(() => import("@/tools/retro-futuristic/RetroMaterialTool"));
const RetroEnvironment = lazy(() => import("@/tools/retro-futuristic/RetroEnvironment"));
const CoverTool = lazy(() => import("@/tools/cover-tool/CoverTool"));

export default function ToolRenderer() {
  const { activeGeometry, activeMaterial, activeSidebarTab } = useToolStore();
  const meshRef = useRef<THREE.Mesh>(null);

  const { backgroundColor } = useControls("Environment", {
    backgroundColor: { value: "#0a0a0a" },
  });

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  // Handle some specific animations if liquid metal is active, since the material 
  // itself can't easily animate the mesh rotation in R3F without being a custom shader component.
  useFrame((state) => {
    if (activeMaterial === "liquid-metal" && meshRef.current) {
       meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
       meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    } else if (meshRef.current) {
       // Reset rotation if not liquid metal
       meshRef.current.rotation.set(0,0,0);
    }
  });

  return (
    <group>
      {activeMaterial === "retro-futuristic" && (
        <Suspense fallback={null}>
          <RetroEnvironment />
        </Suspense>
      )}
      <Center>
      <mesh ref={meshRef}>
        <Suspense fallback={<boxGeometry args={[1, 1, 1]} />}>
          {/* Render Active Geometry */}
          {activeGeometry === "shape-extrude" && <ShapeExtrudeTool />}
          {activeGeometry === "typography-3d" && <Typography3DTool />}
          {activeGeometry === "import-pipeline" && <ImportPipelineTool />}
          {activeGeometry === "lego-landscape" && <LegoLandscapeTool />}
          
          {/* Render Active Material */}
          {activeMaterial === "default" && <meshStandardMaterial color="#ffffff" />}
          {activeMaterial === "liquid-metal" && <LiquidMetalTool />}
          {activeMaterial === "dream-chrome" && <DreamChromeTool />}
          {activeMaterial === "pixel-world" && <PixelWorldTool />}
          {activeMaterial === "retro-futuristic" && <RetroMaterialTool />}
        </Suspense>
      </mesh>
      
      {/* Post Processing Render (Cover Tool doesn't render inside the mesh) */}
      <EffectComposer>
        <Suspense fallback={null}>
           <CoverTool />
        </Suspense>
      </EffectComposer>
    </Center>
    </group>
  );
}
