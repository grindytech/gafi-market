import { BundleStatus, MarketType } from "../enum";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { ChainDto } from "./ChainDto";
import { NftDto } from "./Nft.dto";
import { NftCollectionDto } from "./NftCollectionDto";
import { PaymentToken } from "./PaymentToken.dto";
import { UserDto } from "./UserDto";

export class BundleDto extends BaseDocumentDto {
  price: number;
  block: number;
  chain: string | ChainDto;
  items: NftDto[];
  seller: UserDto;
  buyer: UserDto;
  txHash: string;
  bundleId: string;
  saltNonce: number;
  nftCollection: string | NftCollectionDto;
  paymentToken: string | PaymentToken;
  // marketType: MarketType;
  signedSignature: string;
  status: BundleStatus;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}
