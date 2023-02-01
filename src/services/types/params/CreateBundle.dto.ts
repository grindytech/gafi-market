export class CreateBundleDto {
  bundleId: string;
  idList: string[];
  signedSignature: string;
  paymentTokenId: string;
  price: number;
  saltNonce: string;
  name: string;
  description?: string;
}
