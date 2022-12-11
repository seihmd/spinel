import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { OrderByClause } from '../../clause/OrderByClause';
import { ReturnClause } from '../../clause/ReturnClause';
import { WhereClause } from '../../clause/WhereClause';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { VariableMap } from '../../literal/util/VariableMap';
import { WhereLiteral } from '../../literal/WhereLiteral';
import { AbstractStatement } from '../AbstractStatement';
import { OrderByQueries } from '../orderBy/OrderByQueries';
import { WhereQuery } from '../where/WhereQuery';

export class FindNodeStatement extends AbstractStatement {
  private readonly nodeLiteral: NodeLiteral;
  private readonly whereQuery: WhereQuery | null;
  private readonly orderByQueries: OrderByQueries | null;

  constructor(
    nodeLiteral: NodeLiteral,
    whereQuery: WhereQuery | null,
    orderByQueries: OrderByQueries | null
  ) {
    super();

    this.nodeLiteral = nodeLiteral;
    this.whereQuery = whereQuery;
    this.orderByQueries = orderByQueries;
  }

  protected build(): string {
    return (
      `${
        this.getMatchClause() + this.getWhereClause() + this.getReturnClause()
      } AS ${this.as()}` + this.getOrderByClause()
    );
  }

  private getMatchClause(): string {
    return new MatchNodeClause(this.nodeLiteral).get();
  }

  private getWhereClause(): string {
    if (this.whereQuery === null) {
      return ' ';
    }

    return ` ${new WhereClause(
      WhereLiteral.newWithVariableMap(
        this.whereQuery.getQuery(),
        new VariableMap(new Map([['*', this.nodeLiteral.getVariableName()]]))
      )
    ).get()} `;
  }

  private getOrderByClause(): string {
    if (this.orderByQueries === null) {
      return '';
    }
    const orderBy = new OrderByClause(
      this.orderByQueries.getLiterals(
        new VariableMap(new Map([['*', this.nodeLiteral.getVariableName()]]))
      )
    ).get();

    if (orderBy === '') {
      return '';
    }
    return ` ${orderBy}`;
  }

  private getReturnClause(): string {
    return new ReturnClause([
      `${this.nodeLiteral.getVariableName()}{.*}`,
    ]).get();
  }
}
