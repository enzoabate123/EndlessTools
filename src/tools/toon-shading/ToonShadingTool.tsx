"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { Outlines } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

export default function ToonShadingTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "toon-shading";

  const { baseColor, outlineThickness, shadowSteps } = useControls("Toon Shading", {
    baseColor: { value: "#8aff33", label: "Base Color" },
    outlineThickness: { value: 0.15, min: 0, max: 2.0, step: 0.01, label: "Outline Thickness" },
    shadowSteps: { value: 3, min: 2, max: 5, step: 1, label: "Shadow Steps" }
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

  return (
    <>
      <meshToonMaterial color={baseColor} gradientMap={gradientMap} />
      <Outlines thickness={outlineThickness} color="black" />
    </>
  );
}
