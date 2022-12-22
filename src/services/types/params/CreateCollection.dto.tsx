export class CreateCollectionDto {
  id: string;
  name: string;
  key: string;
  nftContract: string;
  game: string;
  chain: string;
  paymentToken: string[];
  avatar?: File;
  cover?: File;
  featuredImage?: File;
}
