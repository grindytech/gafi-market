import { createSlice } from "@reduxjs/toolkit";
import { NftDto } from "../services/types/dtos/Nft.dto";

export type BagState = {
  items: NftDto[];
  isOpen: boolean;
};

export const bagSlice = createSlice({
  name: "bag",
  initialState: {
    items: [],
    isOpen: false,
  },
  reducers: {
    add: (state, { payload }) => {
      const { item } = payload;
      state.items.push(item);
    },
    remove: (state, { payload }) => {
      const { id } = payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
    reset: (state) => {
      state.items = [];
    },
    setIsOpen: (state, { payload }) => {
      state.isOpen = !!payload;
    },
  },
});

export const { add, reset, setIsOpen, remove } = bagSlice.actions;

export const selectBag = (state: any): BagState => state.bag;

export default bagSlice.reducer;
