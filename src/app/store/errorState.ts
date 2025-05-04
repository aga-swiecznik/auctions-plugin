import { create } from 'zustand';

interface ErrorStoreState {
  errors: Record<string, string | null>;

  setError: (endpoint: string, message: string | null) => void;
  clearAllErrors: () => void;
}

export const useErrorStore = create<ErrorStoreState>((set) => ({
  errors: {},
  setError: (endpoint, message) =>
    set((state) => ({
      errors: { ...state.errors, [endpoint]: message },
    })),
  clearAllErrors: () =>
    set({ errors: {} }),
}));
