export type Sort = 'ASC' | 'DESC';

export class OrderByLiteral {
  private readonly query: string;
  private readonly sort: Sort;

  constructor(query: string, sort: Sort) {
    this.query = query;
    this.sort = sort;
  }

  get(): string {
    return `${this.query} ${this.sort}`;
  }
}
