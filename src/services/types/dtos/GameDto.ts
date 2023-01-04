import { Socials } from "./Socials";

export class GameDto {
  name: string;
  key: string;
  avatar?: string;
  cover?: string;
  featuredImage?: string;
  owners: string[];
  status: "active" | "deActive";
  description?: string;
  socials?: Socials;
}
