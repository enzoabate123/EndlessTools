"use client";

import { useControls, button } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { OBJLoader } from "three-stdlib";

export default function ImportPipelineTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "import-pipeline";

  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  const handleModelUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".gltf,.glb,.obj";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (extension === "gltf" || extension === "glb") {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
          let foundGeometry: THREE.BufferGeometry | null = null;
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && !foundGeometry) {
              foundGeometry = (child as THREE.Mesh).geometry;
            }
          });
          if (foundGeometry) {
            setGeometry(foundGeometry);
          }
          URL.revokeObjectURL(url);
        });
      } else if (extension === "obj") {
        const loader = new OBJLoader();
        loader.load(url, (obj) => {
          let foundGeometry: THREE.BufferGeometry | null = null;
          obj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && !foundGeometry) {
              foundGeometry = (child as THREE.Mesh).geometry;
            }
          });
          if (foundGeometry) {
            setGeometry(foundGeometry);
          }
          URL.revokeObjectURL(url);
        });
      }
    };
    input.click();
  };

  useControls("Import Mesh", {
    upload: button(handleModelUpload),
  }, { render: () => renderControls });

  if (geometry) {
    return <primitive object={geometry} attach="geometry" />;
  }

  // Return a generic sphere to represent the imported object before upload
  return <sphereGeometry args={[1.5, 32, 32]} />;
}
