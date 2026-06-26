"use client";
import React from "react";

import { useToolStore, GeometryType, MaterialType } from "@/store/useToolStore";
import { Box, Type, Import, Settings2, Droplet, Grid3x3, Gem, Cuboid, MousePointer2, Sun } from "lucide-react";
import { Box, Type, Import, Settings2, Droplet, Grid3x3, Gem, Cuboid, MousePointer2, Palette } from "lucide-react";
import { Box, Type, Import, Settings2, Droplet, Grid3x3, Gem, Cuboid, MousePointer2, LucideIcon } from "lucide-react";

const geometryTools = [
  { id: "shape-extrude", name: "3D Extrude", icon: Box },
  { id: "typography-3d", name: "Typography", icon: Type },
  { id: "import-pipeline", name: "Import Mesh", icon: Import },
  { id: "lego-landscape", name: "Lego Landscape", icon: Grid3x3 },
] as const;

const materialTools = [
  { id: "default", name: "Default Material", icon: MousePointer2 },
  { id: "liquid-metal", name: "Liquid Metal", icon: Droplet },
  { id: "dream-chrome", name: "Dream Chrome", icon: Gem },
  { id: "pixel-world", name: "Pixel World", icon: Cuboid },
  { id: "retro-futuristic", name: "Retro Futuristic", icon: Sun },
  { id: "toon-shading", name: "Toon Shading", icon: Palette },
  { id: "color-flow", name: "Color Flow", icon: Palette },
] as const;

const effectTools = [
  { id: "cover-tool", name: "Cover Filters", icon: Settings2 },
  { id: "motion-trails", name: "Motion Trails", icon: Settings2 },
] as const;

export default function ToolsSidebar() {
  const { 
    activeSidebarTab, 
    setActiveSidebarTab, 
    activeGeometry, 
    setActiveGeometry,
    activeMaterial,
    setActiveMaterial
  } = useToolStore();

  const handleGeometryClick = (id: GeometryType) => {
    setActiveGeometry(id);
    setActiveSidebarTab(id as string);
  };

  const handleMaterialClick = (id: MaterialType) => {
    setActiveMaterial(id);
    setActiveSidebarTab(id as string);
  };

  const handleEffectClick = (id: string) => {
    setActiveSidebarTab(id);
  };

  const renderButton = (
    id: string, 
    name: string, 
    Icon: React.ComponentType<{strokeWidth?: number, className?: string}>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon: any, 
    Icon: React.ComponentType<{ strokeWidth?: number; className?: string }>,
    Icon: React.ElementType,
    Icon: LucideIcon,
    isActive: boolean, 
    onClick: () => void
  ) => (
    <button
      key={id}
      onClick={onClick}
      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
        isActive 
          ? "bg-white text-black" 
          : "bg-transparent text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
      title={name}
    >
      {/* @ts-expect-error - Lucide icons accept strokeWidth */}
      <Icon strokeWidth={isActive ? 2.5 : 2} className="w-5 h-5" />
    </button>
  );

  return (
    <aside className="w-[70px] border-r border-white/10 bg-[#0f0f0f] flex flex-col items-center py-6 gap-6 z-20 overflow-y-auto">
      <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-bold text-xl mb-2 shrink-0">
        E
      </div>
      
      {/* Geometries Section */}
      <div className="flex flex-col gap-2 w-full items-center">
        <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider mb-1">Shape</div>
        {geometryTools.map((tool) => 
          renderButton(
            tool.id, 
            tool.name, 
            tool.icon, 
            activeGeometry === tool.id, 
            () => handleGeometryClick(tool.id)
          )
        )}
      </div>

      <div className="w-8 h-px bg-white/10 my-2"></div>

      {/* Materials Section */}
      <div className="flex flex-col gap-2 w-full items-center">
        <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider mb-1">Material</div>
        {materialTools.map((tool) => 
          renderButton(
            tool.id, 
            tool.name, 
            tool.icon, 
            activeMaterial === tool.id, 
            () => handleMaterialClick(tool.id)
          )
        )}
      </div>

      <div className="w-8 h-px bg-white/10 my-2"></div>

      {/* Post Processing Section */}
      <div className="flex flex-col gap-2 w-full items-center">
        <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider mb-1">Post</div>
        {effectTools.map((tool) => 
          renderButton(
            tool.id, 
            tool.name, 
            tool.icon, 
            activeSidebarTab === tool.id, 
            () => handleEffectClick(tool.id)
          )
        )}
      </div>
    </aside>
  );
}
