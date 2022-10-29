import { Path } from '../path/Path';
import { placeholder } from './util/placeholder';
import { VariableMap } from './util/VariableMap';

type Sort = 'ASC' | 'DESC';

export class OrderByLiteral {
  static new(query: string, sort: Sort, path: Path): OrderByLiteral {
    return new OrderByLiteral(placeholder(query, VariableMap.new(path)), sort);
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
