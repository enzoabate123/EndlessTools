"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function ShapeExtrudeTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  
  // We only render the Leva controls if this tab is active
  const renderControls = activeSidebarTab === "shape-extrude";

  const { depth, width, height } = useControls("Shape Extrude", {
    width: { value: 2, min: 0.1, max: 10, step: 0.1 },
    height: { value: 2, min: 0.1, max: 10, step: 0.1 },
    depth: { value: 1, min: 0.1, max: 10, step: 0.1 },
  }, { render: () => renderControls });

  return <boxGeometry args={[width, height, depth]} />;
}
