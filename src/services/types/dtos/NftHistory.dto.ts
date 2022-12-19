import { HistoryType } from "../enum";
import { Attribute } from "./Attribute";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { ChainDto } from "./ChainDto";
import { NftCollectionDto } from "./NftCollectionDto";
import { PaymentToken } from "./PaymentToken.dto";
import { UserDto } from "./UserDto";

export class NftHistoryDto extends BaseDocumentDto {
  nftContract: string;
  name: string;
  tokenId: string;
  txHash: string;
  attributes: Attribute[];
  block: number;
  chain: ChainDto;
  from: UserDto;
  to: UserDto;
  nftCollection: NftCollectionDto;
  paymentToken: PaymentToken;
  price: number;
  priceInUsd: number;
  type: HistoryType;
  image?: string;
}
