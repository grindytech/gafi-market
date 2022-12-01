import { createSlice } from "@reduxjs/toolkit";
import { ChainDto } from "../services/types/dtos/ChainDto";
import { PaymentToken } from "../services/types/dtos/PaymentToken.dto";

export type SystemState = {
  chains: ChainDto[];
  paymentTokens: PaymentToken[];
};
export const systemSlice = createSlice({
  name: "system",
  initialState: {
    chains: [],
    paymentTokens: [],
  },
  reducers: {
    setChains: (state, { payload }) => {
      const { chains } = payload;
      state.chains = chains;
    },
    setPaymentTokens: (state, { payload }) => {
      const { paymentTokens } = payload;
      state.paymentTokens = paymentTokens;
    },
  },
});
export const { setChains, setPaymentTokens } = systemSlice.actions;
export const selectSystem = (state: any): SystemState => state.system;
export default systemSlice.reducer;
