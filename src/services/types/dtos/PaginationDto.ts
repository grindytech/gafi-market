export class PaginationDto<T> {
  public total: number;

  public currentPage: number;

  public size: number;

  public pages: number;

  public hasNext: boolean;

  public hasPrevious: boolean;

  public items: T[];
}
