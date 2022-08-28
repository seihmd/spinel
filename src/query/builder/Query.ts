import { BranchQueryContext } from './BranchQueryContext';
import { ReturnClause } from '../clause/ReturnClause';
import { StemQueryContext } from './StemQueryContext';
import { MatchPathClause } from '../clause/MatchPathClause';
import { MapLiteral } from '../literal/MapLiteral';
import { MapEntryLiteral } from '../literal/MapEntryLiteral';
import { WhereClause } from '../clause/WhereClause';

export class Query {
  private stemQueryContext: StemQueryContext;
  private branchQueryContexts: BranchQueryContext[];

  constructor(
    stemQueryContext: StemQueryContext,
    branchQueryContexts: BranchQueryContext[]
  ) {
    this.stemQueryContext = stemQueryContext;
    this.branchQueryContexts = branchQueryContexts;
  }

  get(as: string): string {
    return (
      this.getMatchClause() + this.getWhereClause() + this.getReturnClause(as)
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

  private getReturnClause(as: string): string {
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
        as
      ),
    ]).get();
  }
}
