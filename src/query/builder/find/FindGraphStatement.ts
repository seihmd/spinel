import { MatchPathClause } from '../../clause/MatchPathClause';
import { OrderByClause } from '../../clause/OrderByClause';
import { ReturnClause } from '../../clause/ReturnClause';
import { WhereClause } from '../../clause/WhereClause';
import { MapEntryLiteral } from '../../literal/MapEntryLiteral';
import { MapLiteral } from '../../literal/MapLiteral';
import { AbstractStatement } from '../AbstractStatement';
import { BranchQueryContext } from '../find/BranchQueryContext';
import { StemQueryContext } from '../find/StemQueryContext';

export class FindGraphStatement extends AbstractStatement {
  private stemQueryContext: StemQueryContext;
  private branchQueryContexts: BranchQueryContext[];

  constructor(
    stemQueryContext: StemQueryContext,
    branchQueryContexts: BranchQueryContext[]
  ) {
    super();
    this.stemQueryContext = stemQueryContext;
    this.branchQueryContexts = branchQueryContexts;
  }

  build(): string {
    return (
      this.getMatchClause() +
      this.getWhereClause() +
      this.getReturnClause() +
      this.getOrderByClause() +
      this.getLimitClause()
    );
  }

  private getMatchClause(): string {
    return new MatchPathClause(this.stemQueryContext.getPathLiteral()).get();
  }

  private getWhereClause(): string {
    const whereLiteral = this.stemQueryContext.getWhereStatement();
    if (whereLiteral === null) {
      return ' ';
    }

    return ` ${new WhereClause(whereLiteral).get()} `;
  }

  private getOrderByClause(): string {
    const orderBy = new OrderByClause(
      this.stemQueryContext.getOrderByLiterals()
    ).get();
    if (orderBy === '') {
      return '';
    }
    return ` ${orderBy}`;
  }

  private getLimitClause(): string {
    const limitClause = this.stemQueryContext.getLimitClause();
    if (limitClause === null) {
      return '';
    }

    return ` ${limitClause.get()}`;
  }

  private getReturnClause(): string {
    return new ReturnClause([
      new MapLiteral(
        MapEntryLiteral.new([
          ...this.stemQueryContext.getMapEntries(),
          ...this.branchQueryContexts.reduce(
            (entries: [string, string][], branchQueryContext) => {
              entries.push(...branchQueryContext.getMapEntries());
              return entries;
            },
            []
          ),
        ]),
        this.as()
      ),
    ]).get();
  }
}
