import { SalePeriod, SaleType } from "../enum";

export class GetHashMessage {
  id: string;
  paymentTokenId: string;
  price: number;
  period: SalePeriod;
  option: SaleType;
  ownerAccept: true;
}
