import { create } from 'zustand';

export type GeometryType = 'shape-extrude' | 'typography-3d' | 'import-pipeline' | 'lego-landscape' | null;
export type MaterialType = 'default' | 'liquid-metal' | 'dream-chrome' | 'pixel-world' | 'toon-shading','color-flow';

interface ToolState {
  // What the user is currently editing in the sidebar
  activeSidebarTab: string | null;
  setActiveSidebarTab: (tabId: string) => void;

  // Scene Composition State
  activeGeometry: GeometryType;
  baseGeometry: GeometryType;
  setActiveGeometry: (geo: GeometryType) => void;

  activeMaterial: MaterialType;
  setActiveMaterial: (mat: MaterialType) => void;
  
  // Post processing (Array for multiple overlapping effects)
  activeFilters: string[];
  toggleFilter: (filterId: string) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeSidebarTab: 'typography-3d', // Default selected UI
  setActiveSidebarTab: (tabId) => set({ activeSidebarTab: tabId }),

  activeGeometry: 'typography-3d', // Default geometry
  baseGeometry: 'typography-3d',
  setActiveGeometry: (geo) => set((state) => {
    if (geo === 'lego-landscape') {
      return { activeGeometry: geo };
    } else {
      return { activeGeometry: geo, baseGeometry: geo };
    }
  }),

  activeMaterial: 'default', // Default material
  setActiveMaterial: (mat) => set({ activeMaterial: mat }),

  activeFilters: [],
  toggleFilter: (filterId) => set((state) => {
    const exists = state.activeFilters.includes(filterId);
    if (exists) {
      return { activeFilters: state.activeFilters.filter((id) => id !== filterId) };
    } else {
      return { activeFilters: [...state.activeFilters, filterId] };
    }
  }),
}));
