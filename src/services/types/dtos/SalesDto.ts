import { BaseDocumentDto } from "./BaseDocumentDto";
import { PaymentToken } from "./PaymentToken.dto";

export class SalesDto extends BaseDocumentDto {
  tokenId: string;

  nftContract: string;

  signedSignature: string;

  saltNonce: string;

  price: number;

  paymentToken: PaymentToken;

  period: number;

  endTime: Date;

  startTime: Date;
}
