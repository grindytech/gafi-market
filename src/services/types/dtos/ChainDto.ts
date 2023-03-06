import { BaseDocumentDto } from "./BaseDocumentDto";

export class ChainDto extends BaseDocumentDto {
  name: string;
  rpc: string;
  chainNumber: number;
  symbol: string;
  explore: string;
  mpContract: string;
  bundleContract: string;
  redeemContract: string;
}
