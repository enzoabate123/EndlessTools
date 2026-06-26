"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";

export default function Typography3DTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "typography-3d";

  const { size, height } = useControls("Typography 3D", {
    text: { value: "Hello" }, // We'll just mock this for now without FontLoader
    size: { value: 2, min: 0.5, max: 10, step: 0.1 },
    height: { value: 0.5, min: 0.1, max: 5, step: 0.1 },
  }, { render: () => renderControls });

  // Returning a Torus as a mock for 3D text until font loaders are set up
  return <torusGeometry args={[size, height, 16, 100]} />;
}
