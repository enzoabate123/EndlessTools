"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function PixelWorldTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "pixel-world";

  const { glassColor, glassOpacity, thickness, ior, dispersion } = useControls("Pixel World", {
    glassColor: { value: "#00ffff" },
    pixelSize: { value: 8, min: 2, max: 32, step: 1 },
    glassOpacity: { value: 0.5, min: 0, max: 1 },
    thickness: { value: 2.0, min: 0, max: 10, step: 0.1 },
    ior: { value: 1.5, min: 1, max: 3, step: 0.01 },
    dispersion: { value: 0.1, min: 0, max: 1, step: 0.01 }
  }, { render: () => renderControls });

  return (
    <meshPhysicalMaterial 
      color={glassColor}
      transparent={true}
      opacity={glassOpacity}
      roughness={0.05}
      transmission={1.0} // Fully transmissive glass
      thickness={thickness}
      ior={ior}
      dispersion={dispersion}
    />
  );
}
