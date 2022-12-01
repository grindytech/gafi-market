import { client } from "./client";
import { BaseResult } from "./types/dtos/BaseResult";
import { ChainDto } from "./types/dtos/ChainDto";
import { PaymentToken } from "./types/dtos/PaymentToken.dto";

const getPaymentTokens = async (): Promise<BaseResult<PaymentToken[]>> => {
  return await client.get("/market/api/paymentTokens");
};
const getChainSupport = async (): Promise<BaseResult<ChainDto[]>> => {
  return await client.get("/market/api/chains");
};

const systemService = { getPaymentTokens, getChainSupport };
export default systemService;
