import { createSlice } from "@reduxjs/toolkit";
import { ChainDto } from "../services/types/dtos/ChainDto";
import { PaymentToken } from "../services/types/dtos/PaymentToken.dto";

export type SystemState = {
  chains: ChainDto[];
  paymentTokens: PaymentToken[];
  fiat: string;
};
export const systemSlice = createSlice({
  name: "system",
  initialState: {
    chains: [],
    paymentTokens: [],
    fiat: "usd",
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
    setFiat: (state, { payload }) => {
      state.fiat = payload;
    },
  },
});
export const { setChains, setPaymentTokens, setFiat } = systemSlice.actions;
export const selectSystem = (state: any): SystemState => state.system;
export default systemSlice.reducer;
