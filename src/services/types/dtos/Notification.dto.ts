import { NotificationStatus } from "../enum";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { BundleDto } from "./BundleDto";
import { NftDto } from "./Nft.dto";
import { UserDto } from "./UserDto";

export class NotificationDto extends BaseDocumentDto {
  nft: NftDto;
  bundle: BundleDto;
  status: NotificationStatus;
  externalLink: string;
  content: string;
  user: UserDto;
  txHash: string;
}
