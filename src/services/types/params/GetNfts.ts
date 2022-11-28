import { MarketType } from "../enum";
import { BaseQueryParams } from "./BaseQueryParams";

export class GetNfts extends BaseQueryParams {
  marketType?: MarketType;
  owner?: string;
  minPrice?: number;
  maxPrice?: number;
  collectionId?: string;
  attributes?: {
    key: string;
    value?: string;
    minNumber?: number;
    maxNumber?: number;
    options?: string[];
  }[];
  game?: string;
  chain?: string;
}
