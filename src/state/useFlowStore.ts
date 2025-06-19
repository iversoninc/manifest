// src/state/useFlowStore.ts
import { create } from "zustand";
import type { ScreenData } from "../types/flow";

interface FlowState {
  screens: ScreenData[];
  setScreens: (screens: ScreenData[]) => void;
  mode: "wireframe" | "hifi";
  setMode: (m: "wireframe" | "hifi") => void;
}

type SetState = {
  setState: (partial: Partial<FlowState> | ((state: FlowState) => Partial<FlowState>)) => void;
};

export const useFlowStore = create<FlowState>()((set: SetState["setState"]) => ({
  screens: [],
  setScreens: (screens: ScreenData[]) => set({ screens }),
  mode: "hifi",
  setMode: (mode) => set({ mode }),
}));