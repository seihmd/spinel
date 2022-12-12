import { MatchPathClause } from '../../clause/MatchPathClause';
import { OrderByClause } from '../../clause/OrderByClause';
import { ReturnClause } from '../../clause/ReturnClause';
import { WhereClause } from '../../clause/WhereClause';
import { MapEntryLiteral } from '../../literal/MapEntryLiteral';
import { MapLiteral } from '../../literal/MapLiteral';
import { AbstractStatement } from '../AbstractStatement';
import { BranchQueryContext } from '../match/BranchQueryContext';
import { StemQueryContext } from '../match/StemQueryContext';

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
      this.getOrderByClause()
    );
  }

  private getMatchClause(): string {
    return new MatchPathClause(this.stemQueryContext.getPathLiteral()).get();
  }

  private getWhereClause(): string {
    const whereLiteral = this.stemQueryContext.getWhereLiteral();
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
