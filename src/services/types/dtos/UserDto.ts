import { Roles } from "../enum";
import { BaseDocumentDto } from "./BaseDocumentDto";
import { Socials } from "./Socials";

export class UserDto extends BaseDocumentDto {
  isVerified?: boolean;
  roles?: Roles[];
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
