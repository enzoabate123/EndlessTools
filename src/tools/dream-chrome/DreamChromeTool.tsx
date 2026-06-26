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
    <meshPhysicalMaterial
      color="#ffffff" 
      metalness={1} 
      roughness={0} 
      emissive={glowColor}
      emissiveIntensity={0.2 * chromeIntensity} // Tie it to chrome intensity a bit or keep fixed, but the prompt says: "use um emissive muito forte baseado na cor escolhida"
      envMapIntensity={chromeIntensity * 2} // Very intense environment reflection
    />
  );
}
