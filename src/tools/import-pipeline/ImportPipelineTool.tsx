"use client";

import { useControls, button } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function ImportPipelineTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "import-pipeline";

  useControls("Import Mesh", {
    upload: button(() => {
      alert("Trigger file upload dialog");
    }),
  }, { render: () => renderControls });

  // Return a generic sphere to represent the imported object
  return <sphereGeometry args={[1.5, 32, 32]} />;
}
