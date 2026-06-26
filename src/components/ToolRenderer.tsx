"use client";

import { Suspense, lazy, useRef, useMemo, useLayoutEffect } from "react";
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
const ToonShadingTool = lazy(() => import("@/tools/toon-shading/ToonShadingTool"));
const DreamChromeTool = lazy(() => import("@/tools/dream-chrome/DreamChromeTool"));
const PixelWorldTool = lazy(() => import("@/tools/pixel-world/PixelWorldTool"));
const RetroMaterialTool = lazy(() => import("@/tools/retro-futuristic/RetroMaterialTool"));
const RetroEnvironment = lazy(() => import("@/tools/retro-futuristic/RetroEnvironment"));
const ColorFlowTool = lazy(() => import("@/tools/color-flow/ColorFlowTool"));
const CoverTool = lazy(() => import("@/tools/cover-tool/CoverTool"));
const MotionTrailsTool = lazy(() => import("@/tools/motion-trails/MotionTrailsTool"));

export default function ToolRenderer() {
  const { activeGeometry, baseGeometry, activeMaterial, activeSidebarTab } = useToolStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const targetVector = useMemo(() => new THREE.Vector3(), []);

  const { backgroundColor, followMouse } = useControls("Environment", {
    backgroundColor: { value: "#0a0a0a" },
    followMouse: { value: false },
  });

  const defaultGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  // Prevent R3F unmounting frame from leaving the mesh without a geometry
  useLayoutEffect(() => {
    if (meshRef.current) {
      const mesh = meshRef.current;
      let currentGeo = mesh.geometry || defaultGeometry;
      Object.defineProperty(mesh, "geometry", {
        get() {
          return currentGeo || defaultGeometry;
        },
        set(val) {
          currentGeo = val;
        },
        configurable: true,
      });
    }
  }, [defaultGeometry]);

  // Handle some specific animations if liquid metal is active, since the material 
  // itself can't easily animate the mesh rotation in R3F without being a custom shader component.
  useFrame((state) => {
    if (!meshRef.current) return;

    if (followMouse) {
      targetVector.set(state.pointer.x * 5, state.pointer.y * 5, 5);

      // Calculate current forward vector
      const currentForward = new THREE.Vector3(0, 0, 1).applyQuaternion(meshRef.current.quaternion);

      // Direction to target
      const dirToTarget = targetVector.clone().sub(meshRef.current.position).normalize();

      // Smoothly interpolate the direction
      currentForward.lerp(dirToTarget, 0.1);

      // Look at the new smoothly interpolated point
      const lookAtPoint = meshRef.current.position.clone().add(currentForward);
      meshRef.current.lookAt(lookAtPoint);
    } else {
      if (activeMaterial === "liquid-metal") {
         meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
         meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      } else {
         // Reset rotation if not liquid metal
         meshRef.current.rotation.set(0,0,0);
      }
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
      <mesh ref={meshRef} visible={activeGeometry !== "lego-landscape"}>
        <Suspense fallback={
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffffff" />
          </>
        }>
          {/* Render Base Geometry Always */}
          {baseGeometry === "shape-extrude" && <ShapeExtrudeTool />}
          {baseGeometry === "typography-3d" && <Typography3DTool />}
          {baseGeometry === "import-pipeline" && <ImportPipelineTool />}
          
          {/* Render Active Material for the base mesh */}
          {activeGeometry !== "typography-3d" && (
            <>
              {activeMaterial === "default" && <meshStandardMaterial color="#ffffff" />}
              {activeMaterial === "liquid-metal" && <LiquidMetalTool />}
              {activeMaterial === "dream-chrome" && <DreamChromeTool />}
              {activeMaterial === "pixel-world" && <PixelWorldTool />}
              {activeMaterial === "retro-futuristic" && <RetroMaterialTool />}
              {activeMaterial === "toon-shading" && <ToonShadingTool />}
              {activeMaterial === "color-flow" && <ColorFlowTool />}
            </>
          )}
        </Suspense>
      </mesh>

      {/* Render Lego Landscape Conditionally as a separate entity */}
      {activeGeometry === "lego-landscape" && (
        <Suspense fallback={null}>
          <LegoLandscapeTool baseMeshRef={meshRef}>
            {activeMaterial === "default" && <meshStandardMaterial color="#ffffff" />}
            {activeMaterial === "liquid-metal" && <LiquidMetalTool />}
            {activeMaterial === "dream-chrome" && <DreamChromeTool />}
            {activeMaterial === "pixel-world" && <PixelWorldTool />}
          </LegoLandscapeTool>
        </Suspense>
      )}
      
      {/* Post Processing Render (Cover Tool doesn't render inside the mesh) */}
      <Suspense fallback={null}>
         <CoverTool />
         <MotionTrailsTool meshRef={meshRef} />
      </Suspense>
      <EffectComposer>
        <Suspense fallback={null}>
           <CoverTool />
        </Suspense>
      </EffectComposer>
    </Center>
    </group>
  );
}
