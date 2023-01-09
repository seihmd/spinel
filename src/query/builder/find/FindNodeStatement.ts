import { PositiveInt } from '../../../domain/type/PositiveInt';
import { LimitClause } from '../../clause/LimitClause';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { OrderByClause } from '../../clause/orderBy/OrderByClause';
import { ReturnClause } from '../../clause/ReturnClause';
import { SkipClause } from '../../clause/SkipClause';
import { WhereClause } from '../../clause/WhereClause';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { OrderByLiteral } from '../../literal/OrderByLiteral';
import { AbstractStatement } from '../AbstractStatement';

export class FindNodeStatement extends AbstractStatement {
  constructor(
    private readonly nodeLiteral: NodeLiteral,
    private readonly whereStatement: string | null,
    private readonly orderByLiterals: OrderByLiteral[],
    private readonly limit: PositiveInt | null,
    private readonly skip: PositiveInt | null
  ) {
    super();
  }

  protected build(): string {
    return (
      `${
        this.getMatchClause() + this.getWhereClause() + this.getReturnClause()
      } AS ${this.as()}` +
      this.getOrderByClause() +
      this.getSkipClause() +
      this.getLimitClause()
    );
  }

  private getMatchClause(): string {
    return new MatchNodeClause(this.nodeLiteral).get();
  }

  private getWhereClause(): string {
    if (this.whereStatement === null) {
      return ' ';
    }

    return ` ${new WhereClause(this.whereStatement).get()} `;
  }

  private getOrderByClause(): string {
    if (this.orderByLiterals.length === 0) {
      return '';
    }
    const orderBy = new OrderByClause(this.orderByLiterals).get();
    return ` ${orderBy}`;
  }

  private getLimitClause(): string {
    if (this.limit === null) {
      return '';
    }

    return ` ${new LimitClause(this.limit).get()}`;
  }

  private getReturnClause(): string {
    return new ReturnClause([
      `${this.nodeLiteral.getVariableName()}{.*}`,
    ]).get();
  }

  private getSkipClause(): string {
    if (this.skip === null) {
      return '';
    }

    return ` ${new SkipClause(this.skip).get()}`;
  }
}
