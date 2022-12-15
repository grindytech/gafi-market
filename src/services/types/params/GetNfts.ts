import { MarketType } from "../enum";
import { BaseQueryParams } from "./BaseQueryParams";
import { GetNftAttributes } from "./GetNftAttributes";

export class GetNfts extends BaseQueryParams {
  marketType?: MarketType;
  owner?: string;
  minPrice?: number;
  maxPrice?: number;
  collectionId?: string;
  attributes?: GetNftAttributes[];
  game?: string;
  chain?: string;
  paymentTokenId?: string;
  idList?: string[];
}
