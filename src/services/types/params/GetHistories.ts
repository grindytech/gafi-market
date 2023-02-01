import { HistoryType } from "../enum";
import { BaseQueryParams } from "./BaseQueryParams";

export class GetHistories extends BaseQueryParams {
  block?: number;
  chain?: string;
  userAddress?: string;
  type?: HistoryType[];
  tokenId?: string;
  nftCollection?: string;
  nftContract?: string;
  nft?: string;
}
