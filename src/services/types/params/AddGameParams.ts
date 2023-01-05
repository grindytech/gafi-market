export class AddGameParams {
  name: string;
  key: string;
  avatar?: string;
  cover?: string;
  featuredImage?: string;
  owners: string[];
  status: "active" | "deActive";
  description?: string;
  socials?: string; // Socials;
  collections?: string[];
}
