import { writable } from "svelte/store";

export interface TransitionState {
  active: boolean;
  originX: number;
  originY: number;
}

const initialState: TransitionState = {
  active: false,
  originX: 50,
  originY: 50,
};

function createPageTransition() {
  const { subscribe, set, update } = writable<TransitionState>(initialState);

  return {
    subscribe,
    trigger: (x: number, y: number) => {
      set({ active: true, originX: x, originY: y });
    },
    reset: () => {
      set(initialState);
    },
  };
}

export const pageTransition = createPageTransition();
