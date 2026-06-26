"use client";

import { useControls, folder } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { Text3D } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Typography3DTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "typography-3d";

  const {
    text,
    size,
    height,
    letterSpacing,
    animationType,
    speed,
    offsetDelay
  } = useControls("Typography 3D", {
    text: { value: "Hello" },
    size: { value: 2, min: 0.5, max: 10, step: 0.1 },
    height: { value: 0.5, min: 0.1, max: 5, step: 0.1 },
    letterSpacing: { value: 0.2, min: 0, max: 2, step: 0.05 },

    "Kinetic Config": folder({
      animationType: {
        options: ["None", "Wave", "Spin", "Breathe", "Typing"],
        value: "Wave"
      },
      speed: { value: 2, min: 0.1, max: 10, step: 0.1 },
      offsetDelay: { value: 0.5, min: 0, max: 2, step: 0.05 }
    })
  }, { render: () => renderControls });

  const characters = useMemo(() => text.split(""), [text]);
  const groupRef = useRef<THREE.Group>(null);

  // We use objects to keep references to the mesh for base positioning and an inner group/mesh for animation
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    // 1. Layout logic (calculating widths directly in useFrame, it's fast enough)
    const widths: number[] = [];
    let allLoaded = true;

    for (let i = 0; i < characters.length; i++) {
        const mesh = meshesRef.current[i];
        if (mesh && mesh.geometry) {
            mesh.geometry.computeBoundingBox();
            const bbox = mesh.geometry.boundingBox;
            if (bbox) {
                widths[i] = bbox.max.x - bbox.min.x;
            } else {
                allLoaded = false;
                break;
            }
        } else {
            allLoaded = false;
            break;
        }
    }

    if (allLoaded && groupRef.current) {
        const totalWidth = widths.reduce((sum, w) => sum + w, 0) + (characters.length - 1) * letterSpacing;
        const startX = -totalWidth / 2;
        let currentX = startX;

        for (let i = 0; i < characters.length; i++) {
            const mesh = meshesRef.current[i];
            if (!mesh) continue;

            // Base positioning
            mesh.position.x = currentX;
            currentX += widths[i] + letterSpacing;
        }
    }

    // 2. Animation Logic
    const time = state.clock.elapsedTime;

    for (let i = 0; i < characters.length; i++) {
      const mesh = meshesRef.current[i];
      if (!mesh) continue;

      const localTime = time * speed - i * offsetDelay;

      // Reset transforms
      mesh.position.y = 0;
      mesh.rotation.y = 0;
      mesh.scale.set(1, 1, 1);

      switch (animationType) {
          case "Wave":
              mesh.position.y = Math.sin(localTime) * (size * 0.2);
              break;
          case "Spin":
              mesh.rotation.y = localTime;
              break;
          case "Breathe":
              const scale = 1 + Math.sin(localTime) * 0.2;
              mesh.scale.set(scale, scale, scale);
              break;
          case "Typing":
              // Simulate typing drop effect based on time
              const typeTime = time * speed - i * offsetDelay;
              if (typeTime < 0) {
                 mesh.scale.set(0.001, 0.001, 0.001); // Basically hide
              } else if (typeTime < Math.PI / 2) {
                 const tScale = Math.sin(typeTime);
                 mesh.scale.set(tScale, tScale, tScale);
              } else {
                 mesh.scale.set(1, 1, 1);
              }
              break;
          case "None":
          default:
              break;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {characters.map((char, i) => (
        <group key={`${char}-${i}`}>
            <Text3D
              ref={(el) => { meshesRef.current[i] = el; }}
              font="/fonts/helvetiker_regular.typeface.json"
              size={size}
              height={height}
              curveSegments={12}
              bevelEnabled={true}
              bevelThickness={0.05}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
            >
              {char}
            </Text3D>
        </group>
      ))}
    </group>
  );
}
