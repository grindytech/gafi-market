import { PaginationDto } from "./PaginationDto";

export class BaseResultPagination<T> {
  errors: Record<string, string[]>;
  data: PaginationDto<T>;
  success = true;
}
