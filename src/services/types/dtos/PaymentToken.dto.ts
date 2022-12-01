import { BaseDocumentDto } from "./BaseDocumentDto";

export class PaymentToken extends BaseDocumentDto {
  name: string;
  symbol: string;
  chain: string;
  decimals: number;
  contractAddress: string;
  enabled: boolean;
  isNative: boolean;
}
