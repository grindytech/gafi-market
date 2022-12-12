import { BaseDocumentDto } from "./BaseDocumentDto";
import { ChainDto } from "./ChainDto";

export class PaymentToken extends BaseDocumentDto {
  name: string;
  symbol: string;
  chain: string;
  decimals: number;
  contractAddress: string;
  enabled: boolean;
  isNative: boolean;
}
