import { Status } from "../enum";

export class AddCollectionDto {
  name: string;
  key: string;
  nftContract: string;
  game?: string;
  chain: string;
  paymentTokens: string[];
  avatar: File;
  cover: File;
  featuredImage: File;
  processByWorker?: string;
  autoDetect?: boolean;
  enableSendExternalTransfer?: boolean;
  lockTransfer?: number; //in seconds
  description?: string;
  owners?: string[];
  status: Status;
  verified?: boolean;
}
