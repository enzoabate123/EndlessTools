"use client";

import { useControls, button } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { useState, useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";

export default function ShapeExtrudeTool() {
  const activeSidebarTab = useToolStore((s) => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "shape-extrude";

  const [shapes, setShapes] = useState<THREE.Shape[]>([]);

  const handleSVGUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".svg";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const loader = new SVGLoader();
        const svgData = loader.parse(text);

        const newShapes: THREE.Shape[] = [];
        svgData.paths.forEach((path) => {
          const pathShapes = SVGLoader.createShapes(path);
          newShapes.push(...pathShapes);
        });

        setShapes(newShapes);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const { depth, bevelEnabled, bevelThickness, bevelSize } = useControls(
    "Shape Extrude",
    {
      depth: { value: 2, min: 0.1, max: 10, step: 0.1 },
      bevelEnabled: { value: true },
      bevelThickness: { value: 0.2, min: 0, max: 2, step: 0.05 },
      bevelSize: { value: 0.1, min: 0, max: 2, step: 0.05 },
      "Upload SVG": button(handleSVGUpload),
    },
    { render: () => renderControls }
  );

  const extrudeSettings = useMemo(
    () => ({
      depth,
      bevelEnabled,
      bevelThickness,
      bevelSize,
      bevelSegments: 3,
      curveSegments: 12,
      center: true
    }),
    [depth, bevelEnabled, bevelThickness, bevelSize]
  );

  if (shapes.length === 0) {
    return <boxGeometry args={[2, 2, depth]} />;
  }

  // NOTE: the issue is probably that the paths from SVGLoader are offset far from origin.
  // In a real geometry context where we only provide <extrudeGeometry>,
  // Drei's <Center> wraps meshes, but we can't wrap a geometry with <Center>.
  // We should manually center the geometry once created.
  // R3F handles component updates. We can use a ref or an effect, or just rely on R3F's auto-center or the user's manual offset.
  // Actually, SVGLoader paths are usually inverted Y.
  // Since we only return geometry here, it's best to let the outer component handle position,
  // or we can just return the geometry as is.

  return <extrudeGeometry args={[shapes, extrudeSettings]} />;
}
