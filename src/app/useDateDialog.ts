import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = {
  auctionId: '',
  date: undefined,
};

const useCopyDialog = create(
  devtools<{
    auctionId: string;
    date: Date | undefined;
    setIds: (auctionId: string, date: Date) => void;
    closeDialog: () => void;
    clear: () => void;
  }>((set) => ({
    ...initialState,
    closeDialog: () =>
      set((state) => {
        return ({
        ...state,
        auctionId: '',
        date: undefined,
      })}),
    setIds: (auctionId: string, date: Date) =>
      set((state) => ({
        ...state,
        auctionId,
        date
      })),
    clear: () => set(initialState),
  })),
);

export default useCopyDialog;
