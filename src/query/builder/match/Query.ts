import { MatchPathClause } from '../../clause/MatchPathClause';
import { OrderByClause } from '../../clause/OrderByClause';
import { ReturnClause } from '../../clause/ReturnClause';
import { WhereClause } from '../../clause/WhereClause';
import { MapEntryLiteral } from '../../literal/MapEntryLiteral';
import { MapLiteral } from '../../literal/MapLiteral';
import { BranchQueryContext } from './BranchQueryContext';
import { StemQueryContext } from './StemQueryContext';

/**
 * @deprecated FindGraphStatement
 */
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
      this.getMatchClause() +
      this.getWhereClause() +
      this.getReturnClause(as) +
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
