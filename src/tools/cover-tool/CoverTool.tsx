"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function CoverTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "cover-tool";

  useControls("Cover Filters", {
    filter: { options: ["None", "Halftone", "Glitch", "Kaleidoscope"] },
    intensity: { value: 0.5, min: 0, max: 1, step: 0.01 },
  }, { render: () => renderControls });

  // This would ideally return PostProcessing effects, but for now we'll return null
  // because postprocessing must be wrapped in <EffectComposer> outside the mesh.
  return null;
}
