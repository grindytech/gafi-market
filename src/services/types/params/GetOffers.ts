import { OfferStatus } from "../enum";
import { BaseQueryParams } from "./BaseQueryParams";

export class GetOffers extends BaseQueryParams {
  nft?: string;
  minPrice?: number;
  maxPrice?: number;
  buyer?: string;
  seller?: string;
  nftContract?: string;
  paymentToken?: string;
  status?: OfferStatus;
  optional?: boolean;
}
