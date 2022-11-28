import { BaseDocumentDto } from "./BaseDocumentDto";
import { ChainDto } from "./ChainDto";

export class PaymentTokenDto extends BaseDocumentDto {
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
  enabled: boolean;
  chain: ChainDto;
}
