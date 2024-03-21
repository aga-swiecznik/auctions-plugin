import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = {
  auctionId: '',
  groupId: '',
};

const useCopyDialog = create(
  devtools<{
    auctionId: string;
    groupId: string;
    setIds: (auctionId: string, groupId: string) => void;
    closeDialog: () => void;
    clear: () => void;
  }>((set) => ({
    ...initialState,
    closeDialog: () =>
      set((state) => {
        return ({
        ...state,
        auctionId: '',
        groupId: '',
      })}),
    setIds: (auctionId: string, groupId: string) =>
      set((state) => ({
        ...state,
        auctionId,
        groupId
      })),
    clear: () => set(initialState),
  })),
);

export default useCopyDialog;
