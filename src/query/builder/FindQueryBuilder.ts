import { ClassConstructor } from '../../domain/type/ClassConstructor';
import { PositiveInt } from '../../domain/type/PositiveInt';
import { Sort } from '../literal/OrderByLiteral';
import { QueryPlan } from './match/QueryPlan';
import { OrderByQueries } from './orderBy/OrderByQueries';
import { OrderByQuery } from './orderBy/OrderByQuery';
import { SessionInterface } from './session/SessionInterface';
import { WhereQueries } from './where/WhereQueries';
import { WhereQuery } from './where/WhereQuery';

export class FindQueryBuilder<S> {
  private readonly session: SessionInterface;
  private readonly cstr: ClassConstructor<S>;
  private readonly alias: string;

  private whereClauses: [string | null, string][] = [];
  private orderByClauses: [string, Sort][] = [];
  private limitValue: PositiveInt | null = null;

  constructor(
    session: SessionInterface,
    cstr: ClassConstructor<S>,
    alias: string
  ) {
    this.session = session;
    this.cstr = cstr;
    this.alias = alias;
  }

  where(key: string | null, clause: string): FindQueryBuilder<S> {
    this.whereClauses.push([key, clause]);
    return this;
  }

  orderBy(clause: string, sort: Sort): FindQueryBuilder<S> {
    this.orderByClauses.push([clause, sort]);
    return this;
  }

  limit(value: number): FindQueryBuilder<S> {
    if (this.limitValue !== null) {
      throw new Error('limit() can only be called once.');
    }

    this.limitValue = new PositiveInt(value);
    return this;
  }

  async run(parameters: Record<string, unknown>): Promise<S[]> {
    const queryPlan = QueryPlan.new(this.session);

    return await queryPlan.execute(this.cstr, {
      whereQueries: new WhereQueries(
        this.whereClauses.map(([key, clause]) => new WhereQuery(key, clause))
      ),
      orderByQueries: new OrderByQueries(
        this.orderByClauses.map(
          ([clause, sort]) => new OrderByQuery(clause, sort)
        )
      ),
      parameters,
    });
  }
}
