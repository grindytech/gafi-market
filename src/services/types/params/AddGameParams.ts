export class AddGameParams {
  name: string;
  key: string;
  avatar?: string;
  cover?: string;
  featuredImage?: string;
  owners: string[];
  status: "active" | "deActive";
  description?: string;
  facebook?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  website?: string;
}
