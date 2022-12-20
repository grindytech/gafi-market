import { BaseDocumentDto } from "./BaseDocumentDto";
import { Socials } from "./Socials";

export class UserDto extends BaseDocumentDto {
  isVerified?: boolean;
  roles?: string[];
  nonce?: number;
  username?: string;
  address?: string;
  emailVerified?: boolean;
  email?: string;
  avatar?: string;
  cover?: string;
  name?: string;
  socials?: Socials;
  about?: string;
}
