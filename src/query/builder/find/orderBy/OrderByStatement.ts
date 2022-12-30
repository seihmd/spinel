import { Sort } from '../../../literal/OrderByLiteral';

export class OrderByStatement {
  constructor(
    private readonly statement: string,
    private readonly sort: Sort
  ) {}

  getStatement(): string {
    return this.statement;
  }

  getSort(): Sort {
    return this.sort;
  }
}
