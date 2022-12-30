import { BaseQueryParams } from "./BaseQueryParams";

export class GetPaymentToken extends BaseQueryParams {
  contractAddress?: string;
  chain?: string;
  symbol?: string;
}
