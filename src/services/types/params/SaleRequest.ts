import { SalePeriod } from "../enum";

export class SaleRequest {
  signedSignature: string;
  paymentTokenId: string;
  price: number;
  period: SalePeriod;
}
