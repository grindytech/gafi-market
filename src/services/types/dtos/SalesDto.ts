import { BaseDocumentDto } from "./BaseDocumentDto";
import { PaymentTokenDto } from "./PaymentTokenDto";

export class SalesDto extends BaseDocumentDto {
  tokenId: string;

  nftContract: string;

  signedSignature: string;

  saltNonce: string;

  price: number;

  paymentToken: PaymentTokenDto;
}
