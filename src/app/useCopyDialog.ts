import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = {
  text: '',
};

const useCopyDialog = create(
  devtools<{
    text: string;
    setText: (text: string, onClose?: () => void) => void;
    onClose?: () => void;
    closeDialog: () => void;
    clear: () => void;
  }>((set) => ({
    ...initialState,
    closeDialog: () =>
      set((state) => {
        state.onClose && state.onClose();
        return ({
        ...state,
        text: '',
      })}),
    setText: (text: string, onClose?: () => void) =>
      set((state) => ({
        ...state,
        text,
        onClose
      })),
    clear: () => set(initialState),
  })),
);

export default useCopyDialog;
