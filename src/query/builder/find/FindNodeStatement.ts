import { LimitClause } from '../../clause/LimitClause';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { OrderByClause } from '../../clause/OrderByClause';
import { ReturnClause } from '../../clause/ReturnClause';
import { WhereClause } from '../../clause/WhereClause';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { OrderByLiteral } from '../../literal/OrderByLiteral';
import { AbstractStatement } from '../AbstractStatement';

export class FindNodeStatement extends AbstractStatement {
  constructor(
    private readonly nodeLiteral: NodeLiteral,
    private readonly whereStatement: string | null,
    private readonly orderByLiterals: OrderByLiteral[],
    private readonly limitClause: LimitClause | null
  ) {
    super();
  }

  protected build(): string {
    return (
      `${
        this.getMatchClause() + this.getWhereClause() + this.getReturnClause()
      } AS ${this.as()}` +
      this.getOrderByClause() +
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
    if (this.limitClause === null) {
      return '';
    }

    return ` ${this.limitClause.get()}`;
  }

  private getReturnClause(): string {
    return new ReturnClause([
      `${this.nodeLiteral.getVariableName()}{.*}`,
    ]).get();
  }
}
