import { assignVariables } from './util/assignVariables';
import { VariableMap } from './util/VariableMap';

export type Sort = 'ASC' | 'DESC';

export class OrderByLiteral {
  static new(
    statement: string,
    sort: Sort,
    variableMap: VariableMap
  ): OrderByLiteral {
    return new OrderByLiteral(assignVariables(statement, variableMap), sort);
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
