import { create } from "zustand";

export type Kpis = {
  revenue: number;
  profit: number;
  employees: number;
  visitorsToday: number;
  activeAis: number;
};

export type ChatMsg = { who: "user" | "bot"; text: string };

export type BuildingKey = "training" | "business" | "welfare" | "company";

type Store = {
  virtualDate: Date | null;
  setVirtualDate: (d: Date | null) => void;
  advanceDays: (days: number) => void;

  kpis: Kpis;
  lastKpiUpdate: number;
  randomizeKpis: () => void;

  chat: ChatMsg[];
  pushChat: (msg: ChatMsg) => void;

  pulse: number;
  setPulse: (n: number) => void;

  selectedBuilding: BuildingKey | null;
  hoveredBuilding: BuildingKey | null;
  setSelectedBuilding: (k: BuildingKey | null) => void;
  setHoveredBuilding: (k: BuildingKey | null) => void;
  selectedCard: string | null;
  setSelectedCard: (k: string | null) => void;
};

const baseKpis: Kpis = {
  revenue: 18420,
  profit: 4280,
  employees: 1820,
  visitorsToday: 287,
  activeAis: 14,
};

export const useStore = create<Store>((set) => ({
  virtualDate: null,
  setVirtualDate: (d) => set({ virtualDate: d }),
  advanceDays: (days) =>
    set((s) => {
      const base = s.virtualDate ?? new Date();
      const next = new Date(base);
      next.setDate(next.getDate() + days);
      return { virtualDate: next };
    }),

  kpis: { ...baseKpis },
  lastKpiUpdate: 0,
  randomizeKpis: () =>
    set((s) => {
      const jitter = (n: number, pct: number, integer = false) => {
        const delta = n * pct * (Math.random() * 2 - 1);
        const v = n + delta;
        return integer ? Math.round(v) : Math.round(v * 10) / 10;
      };
      return {
        kpis: {
          revenue: Math.round(jitter(s.kpis.revenue, 0.06)),
          profit: Math.round(jitter(s.kpis.profit, 0.08)),
          employees: Math.max(1500, Math.round(jitter(s.kpis.employees, 0.01, true))),
          visitorsToday: Math.max(0, Math.round(jitter(s.kpis.visitorsToday, 0.20, true))),
          activeAis: Math.max(0, Math.round(jitter(s.kpis.activeAis, 0.30, true))),
        },
        lastKpiUpdate: Date.now(),
      };
    }),

  chat: [
    {
      who: "bot",
      text: "やっほー！ 町案内のフェアリー、ルミナだよ。なんでも聞いてね、めちゃくちゃ盛って答えるから！",
    },
  ],
  pushChat: (msg) => set((s) => ({ chat: [...s.chat, msg] })),

  pulse: 0,
  setPulse: (n) => set({ pulse: n }),

  selectedBuilding: null,
  hoveredBuilding: null,
  setSelectedBuilding: (k) => set({ selectedBuilding: k, selectedCard: null }),
  setHoveredBuilding: (k) => set({ hoveredBuilding: k }),
  selectedCard: null,
  setSelectedCard: (k) => set({ selectedCard: k }),
}));
