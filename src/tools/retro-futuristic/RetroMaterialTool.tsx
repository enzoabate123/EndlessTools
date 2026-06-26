"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function RetroMaterialTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "retro-futuristic";

  const { neonColor, neonIntensity, wireframeThickness } = useControls("Retro Futuristic", {
    neonColor: { value: "#ff00ff" },
    neonIntensity: { value: 2.0, min: 0, max: 10 },
    wireframeThickness: { value: 1, min: 1, max: 10 }
  }, { render: () => renderControls });

  return (
    <meshStandardMaterial
      wireframe={true}
      color={neonColor}
      emissive={neonColor}
      emissiveIntensity={neonIntensity}
      // Note: wireframeLinewidth is often ignored by modern WebGL implementations,
      // but we apply it to satisfy the Leva control requirement.
      wireframeLinewidth={wireframeThickness}
    />
  );
}
