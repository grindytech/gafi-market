import { client } from "./client";
import { BaseResult } from "./types/dtos/BaseResult";
import { ChainDto } from "./types/dtos/ChainDto";
import { PaginationDto } from "./types/dtos/PaginationDto";
import { PaymentToken } from "./types/dtos/PaymentToken.dto";
import { GetPaymentToken } from "./types/params/GetPaymentToken";

const getPaymentTokens = async (
  params: GetPaymentToken
): Promise<BaseResult<PaginationDto<PaymentToken>>> => {
  return await client.get("/market/api/paymentTokens", { params });
};

const getPaymentToken = async (
  id: string
): Promise<BaseResult<PaymentToken>> => {
  return await client.get("/market/api/paymentTokens/" + id);
};
const getChainSupport = async (): Promise<BaseResult<ChainDto[]>> => {
  return await client.get("/market/api/chains");
};

const systemService = { getPaymentTokens, getChainSupport, getPaymentToken };
export default systemService;
