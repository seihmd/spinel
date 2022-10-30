import { Sort } from '../../literal/OrderByLiteral';

export class OrderByQuery {
  private readonly query: string;
  private readonly sort: Sort;

  constructor(query: string, sort: Sort) {
    this.query = query;
    this.sort = sort;
  }

  getQuery(): string {
    return this.query;
  }

  getSort(): Sort {
    return this.sort;
  }
}
