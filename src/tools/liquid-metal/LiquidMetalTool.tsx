"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LiquidMetalTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "liquid-metal";

  const { roughness, metalness, color, speed } = useControls("Liquid Metal", {
    roughness: { value: 0.1, min: 0, max: 1 },
    metalness: { value: 1, min: 0, max: 1 },
    color: { value: "#c0c0c0" },
    speed: { value: 1, min: 0, max: 5 }
  }, { render: () => renderControls });

  // Note: we can't easily animate the parent mesh from here unless we use a custom shader material
  // But we'll provide the material for now.

  return (
    <meshStandardMaterial 
      color={color} 
      roughness={roughness} 
      metalness={metalness}
      envMapIntensity={2}
    />
  );
}
