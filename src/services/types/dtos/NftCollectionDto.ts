import { AttributeMap } from "./AttributeMap";

export class NftCollectionDto {
  name: string;
  key: string;
  nftContract: string;
  avatar: string;
  cover: string;
  attributesMap: AttributeMap[];
  verified: boolean;
}
