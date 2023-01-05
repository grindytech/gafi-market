import { BaseQueryParams } from "./BaseQueryParams";

export class GetGameParams extends BaseQueryParams {
  status?: "active" | "deActive"[];
  key?: string;
  owner?: string[];
}
