"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function DreamChromeTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "dream-chrome";

  const { glowColor, chromeIntensity } = useControls("Dream Chrome", {
    glowColor: { value: "#ff00ff" },
    chromeIntensity: { value: 2, min: 0, max: 5 },
  }, { render: () => renderControls });

  return (
    <meshStandardMaterial
      color="#ffffff" 
      metalness={1} 
      roughness={0} 
      emissive={glowColor}
      emissiveIntensity={0.2}
      envMapIntensity={chromeIntensity}
    />
  );
}
