export class BaseQueryParams {
  search?: string;
  page?: number;
  size?: number;
  orderBy?: string;
  desc?: "desc" | "asc";
}