import { Status } from "../enum";

export class AddGameParams {
  name: string;
  key: string;
  avatar?: string;
  cover?: string;
  featuredImage?: string;
  owners: string[];
  description?: string;
  socials?: string; // Socials;
  collections?: string[];
  status: Status;
}
