"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { Outlines } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ToonShadingTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "toon-shading";

  const { baseColor, outlineColor, outlineThickness, shadowSteps, outlineStyle } = useControls("Toon Shading", {
    baseColor: { value: "#8aff33", label: "Base Color" },
    outlineColor: { value: "#000000", label: "Outline Color" },
    outlineThickness: { value: 0.02, min: 0, max: 0.1, label: "Outline Thickness" },
    shadowSteps: { value: 3, min: 2, max: 5, step: 1, label: "Shadow Steps" },
    outlineStyle: { options: ['exato', 'rabiscado'], value: 'exato', label: 'Outline Style' }
  }, { render: () => renderControls });

  const gradientMap = useMemo(() => {
    const format = THREE.RedFormat;
    const colors = new Uint8Array(shadowSteps);

    for (let c = 0; c <= colors.length; c++) {
        colors[c] = (c / colors.length) * 256;
    }

    const gradientMap = new THREE.DataTexture(colors, colors.length, 1, format);
    gradientMap.needsUpdate = true;
    gradientMap.magFilter = THREE.NearestFilter;
    gradientMap.minFilter = THREE.NearestFilter;

    return gradientMap;
  }, [shadowSteps]);

  const outlineRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (outlineRef.current && outlineStyle === 'rabiscado') {
        const t = clock.getElapsedTime() * 10;
        // Jitter scaling slightly
        const scaleJitter = 1 + (Math.sin(t) * 0.01);
        outlineRef.current.scale.set(scaleJitter, scaleJitter, scaleJitter);

        // Jitter position slightly
        outlineRef.current.position.set(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
        );
    } else if (outlineRef.current) {
        // Reset if exact
        outlineRef.current.scale.set(1, 1, 1);
        outlineRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <>
      <meshToonMaterial color={baseColor} gradientMap={gradientMap} />
      {/*
        Outlines component from drei should be a child of the mesh itself,
        not the material, to work properly. Since ToolRenderer wraps this component
        in a <mesh>, returning a Fragment makes Outlines a sibling to the material
        and thus a child of the <mesh>.
      */}
      <group ref={outlineRef}>
        <Outlines thickness={outlineThickness} color={outlineColor} angle={Math.PI} />
      </group>
    </>
  );
}
