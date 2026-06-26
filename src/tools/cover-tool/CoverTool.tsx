"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { Bloom, DotScreen, Glitch, Pixelation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

export default function CoverTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const activeFilters = useToolStore(s => s.activeFilters);
  const toggleFilter = useToolStore(s => s.toggleFilter);
  const renderControls = activeSidebarTab === "cover-tool";

  useControls("Cover Filters (Toggles)", {
    enableBloom: { value: activeFilters.includes("bloom"), onChange: (v) => { if (v !== activeFilters.includes("bloom")) toggleFilter("bloom") } },
    enableHalftone: { value: activeFilters.includes("halftone"), onChange: (v) => { if (v !== activeFilters.includes("halftone")) toggleFilter("halftone") } },
    enableGlitch: { value: activeFilters.includes("glitch"), onChange: (v) => { if (v !== activeFilters.includes("glitch")) toggleFilter("glitch") } },
    enablePixelation: { value: activeFilters.includes("pixelation"), onChange: (v) => { if (v !== activeFilters.includes("pixelation")) toggleFilter("pixelation") } },
  }, { render: () => renderControls });

  const bloomProps = useControls("Bloom Properties", {
    intensity: { value: 1.5, min: 0, max: 10, step: 0.1 },
    luminanceThreshold: { value: 0.9, min: 0, max: 1, step: 0.01 },
    luminanceSmoothing: { value: 0.025, min: 0, max: 1, step: 0.001 },
  }, { render: () => renderControls && activeFilters.includes("bloom") });

  const halftoneProps = useControls("Halftone Properties", {
    angle: { value: Math.PI / 4, min: 0, max: Math.PI, step: 0.01 },
    scale: { value: 1.0, min: 0.1, max: 5.0, step: 0.1 },
  }, { render: () => renderControls && activeFilters.includes("halftone") });

  const glitchProps = useControls("Glitch Properties", {
    active: { value: true },
    ratio: { value: 0.85, min: 0, max: 1, step: 0.01 },
  }, { render: () => renderControls && activeFilters.includes("glitch") });

  const pixelationProps = useControls("Pixelation Properties", {
    granularity: { value: 5, min: 1, max: 50, step: 1 },
  }, { render: () => renderControls && activeFilters.includes("pixelation") });

  return (
    <>
      {activeFilters.includes("bloom") && (
        <Bloom
          intensity={bloomProps.intensity}
          luminanceThreshold={bloomProps.luminanceThreshold}
          luminanceSmoothing={bloomProps.luminanceSmoothing}
          mipmapBlur
        />
      )}
      {activeFilters.includes("halftone") && (
        <DotScreen
          angle={halftoneProps.angle}
          scale={halftoneProps.scale}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
      {activeFilters.includes("glitch") && (
        <Glitch
          active={glitchProps.active}
          ratio={glitchProps.ratio}
          delay={new Vector2(1.5, 3.5)}
          duration={new Vector2(0.6, 1.0)}
          strength={new Vector2(0.3, 1.0)}
        />
      )}
      {activeFilters.includes("pixelation") && (
        <Pixelation
          granularity={pixelationProps.granularity}
        />
      )}
    </>
  );
}
