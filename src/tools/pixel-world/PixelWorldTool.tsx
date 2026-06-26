"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function PixelWorldTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "pixel-world";

  const { glassColor, glassOpacity } = useControls("Pixel World", {
    glassColor: { value: "#00ffff" },
    pixelSize: { value: 8, min: 2, max: 32, step: 1 },
    glassOpacity: { value: 0.5, min: 0, max: 1 },
  }, { render: () => renderControls });

  return (
    <meshPhysicalMaterial 
      color={glassColor}
      transparent
      opacity={glassOpacity}
      roughness={0.1}
      transmission={0.9}
      thickness={0.5}
    />
  );
}
