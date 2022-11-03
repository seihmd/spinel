import { ClassConstructor } from '../domain/type/ClassConstructor';
import { WhereQuery } from '../query/builder/where/WhereQuery';
import { OrderByQuery } from '../query/builder/orderBy/OrderByQuery';

export class FindQuery<T> {
  private readonly cstr: ClassConstructor<T>;
  private whereQueries: WhereQuery[] = [];
  private orderByQueries: OrderByQuery[] = [];
  private parameters: Record<string, any> = {};

  constructor(cstr: ClassConstructor<T>) {
    this.cstr = cstr;
  }

  getCstr(): ClassConstructor<T> {
    return this.cstr;
  }

  getWhereQueries(): WhereQuery[] {
    return this.whereQueries;
  }

  getOrderByQueries(): OrderByQuery[] {
    return this.orderByQueries;
  }

  getParameters(): Record<string, unknown> {
    return this.parameters;
  }

  where(expr: string): FindQuery<T>;

  where(path: string, expr: string): FindQuery<T>;

  where(a: string, b?: string): FindQuery<T> {
    const query = this.clone();
    query.whereQueries.push(
      new WhereQuery(b === undefined ? null : b, b !== undefined ? b : a)
    );

    return query;
  }

  orderBy(expr: string, sort: 'ASC' | 'DESC'): FindQuery<T> {
    const query = this.clone();
    query.orderByQueries.push(new OrderByQuery(expr, sort));

    return query;
  }

  parameter(key: string, value: unknown): FindQuery<T>;
  parameter(parameters: Record<string, unknown>): FindQuery<T>;

  parameter(a: string | Record<string, unknown>, b?: unknown): FindQuery<T> {
    const query = this.clone();
    if (typeof a === 'string') {
      query.parameters = Object.assign(query.parameters, { [a]: b });
    } else {
      query.parameters = Object.assign(query.parameters, a);
    }

    return query;
  }

  private clone(): FindQuery<T> {
    const newQuery = new FindQuery(this.cstr);
    newQuery.whereQueries = [...this.whereQueries];
    newQuery.orderByQueries = [...this.orderByQueries];
    newQuery.parameters = Object.assign({}, this.parameters);

    return newQuery;
  }
}
