import { MarketType } from "../enum";
import { Attribute } from "./Attribute";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { ChainDto } from "./ChainDto";
import { MediaDto } from "./Media.dto";
import { NftCollectionDto } from "./NftCollectionDto";
import { SalesDto } from "./SalesDto";
import { UserDto } from "./UserDto";

export class NftDto extends BaseDocumentDto {
  marketType: MarketType;
  sale: SalesDto;
  attributes: Attribute[];
  media: MediaDto[];
  image: string;
  originImage: string;
  animationUrl: string;
  animationPlayType: "image" | "video" | "glb" | "iframe";
  owner: UserDto;
  creator: UserDto;
  nftContract: string;
  tokenId: string;
  name: string;
  saltNonce: number;
  bundle: string;
  nftCollection: NftCollectionDto | string;
  price: number;
  lastSold: number;
  lastSoldToken: string;
  chain: ChainDto | string;
  description: string;
  externalUrl: string;
  tokenUrl: string;
}
