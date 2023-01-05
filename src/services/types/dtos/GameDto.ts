import { BaseDocumentDto } from "./BaseDocumentDto";
import { NftCollectionDto } from "./NftCollectionDto";
import { Socials } from "./Socials";

export class GameDto extends BaseDocumentDto {
  name: string;
  key: string;
  avatar?: string;
  cover?: string;
  featuredImage?: string;
  owners: string[];
  status: "active" | "deActive";
  description?: string;
  socials?: Socials;
  collections?: NftCollectionDto[] | string[];
  verified?: boolean;
}
