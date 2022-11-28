import { Attribute } from "./Attribute";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { MarketType } from "../enum";
import { MediaDto } from "./Media.dto";
import { NftCollectionDto } from "./NftCollectionDto";
import { SalesDto } from "./SalesDto";
import { Users } from "./Users";

export class NftDto extends BaseDocumentDto {
  marketType: MarketType;
  sale: SalesDto;
  attributes: Attribute[];
  media: MediaDto[];
  image: string;
  owner: Users;
  nftContract: string;
  tokenId: string;
  name: string;
  saltNonce: number;
  bundle: string;
  nftCollection: NftCollectionDto;
  price: number;
  lastSold: number;
  lastSoldToken: string;
}
