import { SalePeriod } from "../enum";

export class CreateOfferParams {
  offerPrice: number;
  period: SalePeriod;
  paymentTokenId: string;
  signedSignature: string;
  saltNonce: number;
}
