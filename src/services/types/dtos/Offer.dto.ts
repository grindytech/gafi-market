import { OfferStatus } from "../enum";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { ChainDto } from "./ChainDto";
import { NftDto } from "./Nft.dto";
import { NftCollectionDto } from "./NftCollectionDto";
import { PaymentToken } from "./PaymentToken.dto";
import { UserDto } from "./UserDto";

export class OfferDto extends BaseDocumentDto {
  nft: NftDto;
  offerPrice: number;
  saltNonce: number;
  period: number;
  buyer: UserDto;
  seller: UserDto;
  nftContract: string;
  signature: string;
  paymentToken: PaymentToken | string;
  status: OfferStatus;
  option: number;
  startTime: Date;
  endTime: Date;
  id: string;

  name: string;
  tokenId: string;
  image: string;
  nftCollection: NftCollectionDto | string;
  chain: ChainDto;
}
