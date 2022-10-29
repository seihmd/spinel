import { ReturnClause } from '../../clause/ReturnClause';
import { WhereClause } from '../../clause/WhereClause';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { WhereQuery } from '../where/WhereQuery';
import { WhereLiteral } from '../../literal/WhereLiteral';
import { VariableMap } from '../../literal/util/VariableMap';

export class MatchNodeQuery {
  private readonly nodeLiteral: NodeLiteral;
  private readonly whereQuery: WhereQuery | null;

  constructor(nodeLiteral: NodeLiteral, whereQuery: WhereQuery | null) {
    this.nodeLiteral = nodeLiteral;
    this.whereQuery = whereQuery;
  }

  get(as: string): string {
    return `${
      this.getMatchClause() + this.getWhereClause() + this.getReturnClause()
    } AS ${as}`;
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

  private getReturnClause(): string {
    return new ReturnClause([
      `${this.nodeLiteral.getVariableName()}{.*}`,
    ]).get();
  }
}
