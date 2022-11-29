import { BaseQueryParams } from "./BaseQueryParams";

export class GetNftCollections extends BaseQueryParams {
  status?: "active" | "deActive";
  game?: string;
  chain?: string;
  // enableSendExternalTransfer?: boolean;
}
