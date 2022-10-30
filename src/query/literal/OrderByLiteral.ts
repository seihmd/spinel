import { placeholder } from './util/placeholder';
import { VariableMap } from './util/VariableMap';

export type Sort = 'ASC' | 'DESC';

export class OrderByLiteral {
  static new(
    query: string,
    sort: Sort,
    variableMap: VariableMap
  ): OrderByLiteral {
    return new OrderByLiteral(placeholder(query, variableMap), sort);
  }

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
