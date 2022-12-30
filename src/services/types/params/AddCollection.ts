export class AddCollectionDto {
  name: string;
  key: string;
  nftContract: string;
  game?: string;
  chain: string;
  paymentToken: string[];
  status: "active" | "deActive";
  avatar: File;
  cover: File;
  featuredImage: File;
  processByWorker?: string;
  autoDetect?: boolean;
  enableSendExternalTransfer?: boolean;
  lockTransfer?: number; //in seconds
}
