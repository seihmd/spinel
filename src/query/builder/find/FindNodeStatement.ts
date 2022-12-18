import { BRANCH_END } from '../../../domain/graph/pattern/term/PatternTerm';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { OrderByClause } from '../../clause/OrderByClause';
import { ReturnClause } from '../../clause/ReturnClause';
import { WhereStatement } from '../../clause/where/WhereStatement';
import { WhereClause } from '../../clause/WhereClause';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { VariableMap } from '../../literal/util/VariableMap';
import { AbstractStatement } from '../AbstractStatement';
import { OrderByQueries } from '../orderBy/OrderByQueries';

export class FindNodeStatement extends AbstractStatement {
  constructor(
    private readonly nodeLiteral: NodeLiteral,
    private readonly whereStatement: WhereStatement | null,
    private readonly orderByQueries: OrderByQueries | null
  ) {
    super();
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
    if (this.whereStatement === null) {
      return ' ';
    }

    return ` ${new WhereClause(
      this.whereStatement.assign(
        new VariableMap(
          new Map([[BRANCH_END, this.nodeLiteral.getVariableName()]])
        )
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
