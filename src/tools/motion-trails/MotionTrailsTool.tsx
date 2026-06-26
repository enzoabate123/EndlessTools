"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";

export default function MotionTrailsTool({ meshRef }: { meshRef: React.RefObject<THREE.Mesh | null> }) {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "motion-trails";

  const { enabled, trailLength } = useControls("Motion Trails", {
    enabled: { value: false },
    trailLength: { value: 20, min: 1, max: 100, step: 1 },
  }, { render: () => renderControls });

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const [geo, setGeo] = useState<THREE.BufferGeometry | null>(null);
  const [mat, setMat] = useState<THREE.Material | THREE.Material[] | null>(null);

  // To avoid rapid ref issues, keep a stable ref for history
  const historyRef = useRef<THREE.Matrix4[]>([]);

  useEffect(() => {
    // Sync the local ref and state when trail length changes
    if (historyRef.current.length > trailLength) {
      historyRef.current = historyRef.current.slice(0, trailLength);
    }
  }, [trailLength]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Update geometry and material state to re-render instanced mesh if needed
    if (meshRef.current.geometry !== geo) setGeo(meshRef.current.geometry);
    if (meshRef.current.material !== mat) setMat(meshRef.current.material);

    if (enabled) {
      meshRef.current.visible = false;

      const newMatrix = new THREE.Matrix4();
      meshRef.current.updateMatrixWorld(true);
      newMatrix.copy(meshRef.current.matrixWorld);

      historyRef.current.unshift(newMatrix);
      if (historyRef.current.length > trailLength) {
        historyRef.current.pop();
      }

      if (instancedMeshRef.current) {
        // Set the count dynamically
        instancedMeshRef.current.count = historyRef.current.length;

        historyRef.current.forEach((matrix, index) => {
          instancedMeshRef.current!.setMatrixAt(index, matrix);
        });

        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      }
    } else {
      meshRef.current.visible = true;
      historyRef.current = [];
    }
  });

  if (!enabled || !geo || !mat) {
    return null;
  }

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[geo, mat as THREE.Material, trailLength]}
      count={trailLength}
    />
  );
}
