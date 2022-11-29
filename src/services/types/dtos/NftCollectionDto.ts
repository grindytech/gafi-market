import { AttributeMap } from "./AttributeMap";
import { BaseDocumentDto } from "./BaseDocumentDto";

export class NftCollectionDto extends BaseDocumentDto {
  name: string;
  key: string;
  nftContract: string;
  avatar: string;
  cover: string;
  attributesMap: AttributeMap[];
  verified: boolean;
}
