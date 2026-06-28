"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function LegoLandscapeTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "lego-landscape";

  const { blockSize } = useControls("Lego Landscape", {
    blockSize: { value: 0.2, min: 0.05, max: 1 },
    height: { value: 1, min: 0.1, max: 5 },
  }, { render: () => renderControls });

  // Ideally this modifies a mesh, but for now we'll return a geometry representation
  // In a real Voxelizer, this tool would wrap the mesh itself rather than just returning geometry
  return <cylinderGeometry args={[2, 2, 2, 8]} />;
}
