import { Status } from "../enum";
import { AttributeMap } from "./AttributeMap";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { ChainDto } from "./ChainDto";
import { PaymentToken } from "./PaymentToken.dto";
import { Socials } from "./Socials";

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
  featuredImage: string;
  paymentTokens: PaymentToken[] | string[];
  autoDetect: boolean;
  processByWorker: string;
  enableSendExternalTransfer: boolean;
  lockTransfer: number;
  owners: string[];
  status: Status;
}
