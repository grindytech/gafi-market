import { BundleStatus } from "../enum";
import { BaseQueryParams } from "./BaseQueryParams";

export class GetBundleDto extends BaseQueryParams {
  seller?: string;
  buyer?: string;
  bundleId?: string;
  status?: BundleStatus;
  minPrice?: number;
  maxPrice?: number;
  paymentTokenId?: string;
  chain?: string;
  collectionId?: string;
}
