import { BaseDocumentDto } from "./BaseDocumentDto";

export class UserDto extends BaseDocumentDto {
  isVerified: boolean;
  roles: string[];
  nonce: number;
  username: string;
  address: string;
  emailVerified: boolean;
  avatar: string;
  cover: string;
  name: string;
}
