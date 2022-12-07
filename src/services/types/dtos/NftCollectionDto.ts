import { AttributeMap } from "./AttributeMap";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { ChainDto } from "./ChainDto";

export class NftCollectionDto extends BaseDocumentDto {
  name: string;
  key: string;
  nftContract: string;
  avatar: string;
  cover: string;
  attributesMap: AttributeMap[];
  verified: boolean;
  chain: ChainDto;
  description: string;
}
