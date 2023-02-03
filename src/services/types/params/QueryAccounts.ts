import { BaseQueryParams } from "./BaseQueryParams";

export class QueryAccounts extends BaseQueryParams {
  username?: string;
  name?: string;
  address?: string;
  roles?: string[];
}
