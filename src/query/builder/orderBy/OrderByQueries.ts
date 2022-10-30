import { VariableMap } from '../../literal/util/VariableMap';
import { OrderByLiteral } from '../../literal/OrderByLiteral';
import { OrderByQuery } from './OrderByQuery';

export class OrderByQueries {
  private readonly queries: OrderByQuery[];

  constructor(queries: OrderByQuery[]) {
    this.queries = queries;
  }

  getLiterals(variableMap: VariableMap): OrderByLiteral[] {
    return this.queries.map((query: OrderByQuery) =>
      OrderByLiteral.new(query.getQuery(), query.getSort(), variableMap)
    );
  }
}
