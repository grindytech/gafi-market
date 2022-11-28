import { BaseDocumentDto } from "./BaseDocumentDto";
import { Socials } from "./Socials";

export class Users extends BaseDocumentDto {
  username?: string;
  name?: string;
  email?: string;
  avatar?: string;
  cover?: string;
  emailVerified?: boolean;
  address: string;
  nonce: number;

  // @Prop({ type: SchemaTypes.ObjectId, ref: 'NftCollection' })
  // syncedNftCollection?: ObjectId[];

  socials?: Socials;
  isVerified?: boolean;
  roles: string[];
}
