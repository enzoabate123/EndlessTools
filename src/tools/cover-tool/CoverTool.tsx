"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { EffectComposer, DotScreen, Glitch, ChromaticAberration, Bloom, Noise } from "@react-three/postprocessing";
import { GlitchMode, BlendFunction } from "postprocessing";

export default function CoverTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const { activeFilters, toggleFilter } = useToolStore();
  const renderControls = activeSidebarTab === "cover-tool";

  // Check which filters are active
  const hasHalftone = activeFilters.includes("Halftone");
  const hasGlitch = activeFilters.includes("Glitch");
  const hasAberration = activeFilters.includes("ChromaticAberration");
  const hasBloom = activeFilters.includes("Bloom");
  const hasNoise = activeFilters.includes("Noise");

  // In Leva we'll use buttons to toggle the filters instead of a dropdown
  // to allow overlapping filters
  useControls("Cover Filters", {
    "Halftone": { value: hasHalftone, onChange: (v) => { if (v !== hasHalftone) toggleFilter("Halftone") } },
    "Glitch": { value: hasGlitch, onChange: (v) => { if (v !== hasGlitch) toggleFilter("Glitch") } },
    "ChromaticAberration": { value: hasAberration, onChange: (v) => { if (v !== hasAberration) toggleFilter("ChromaticAberration") } },
    "Bloom": { value: hasBloom, onChange: (v) => { if (v !== hasBloom) toggleFilter("Bloom") } },
    "Noise": { value: hasNoise, onChange: (v) => { if (v !== hasNoise) toggleFilter("Noise") } },
  }, { render: () => renderControls }, [activeFilters]);

  // We return the EffectComposer with the active effects
  if (activeFilters.length === 0) return null;

  return (
    <>
      <EffectComposer autoClear={false}>
        {hasHalftone ? <DotScreen blendFunction={BlendFunction.NORMAL} angle={Math.PI * 0.17} scale={0.5} /> : <></>}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        {hasGlitch ? <Glitch delay={[1.5, 3.5]} duration={[0.6, 1.0]} strength={[0.3, 1.0]} mode={GlitchMode.SPORADIC} active={true} ratio={0.85} /> : <></>}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        {hasAberration ? <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.02, 0.002]} /> : <></>}
        {hasBloom ? <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} /> : <></>}
        {hasNoise ? <Noise opacity={0.25} /> : <></>}
      </EffectComposer>
    </>
  );
}
