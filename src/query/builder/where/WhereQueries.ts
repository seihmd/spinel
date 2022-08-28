import { WhereQuery } from './WhereQuery';
import { BranchIndexes } from '../../meterial/BranchIndexes';

export class WhereQueries {
  private readonly whereQueries: WhereQuery[] = [];

  constructor(whereQueries: WhereQuery[]) {
    this.whereQueries = whereQueries;
  }

  add(whereQuery: WhereQuery): WhereQueries {
    return new WhereQueries([...this.whereQueries, whereQuery]);
  }

  ofStem(): WhereQuery | null {
    return this.of(null);
  }

  of(branchIndexes: BranchIndexes | null): WhereQuery | null {
    const key = branchIndexes ? branchIndexes.getGraphKeys().join('.') : null;
    for (const whereQuery of this.whereQueries) {
      if (whereQuery.matchesKey(key)) {
        return whereQuery;
      }
    }
    return null;
  }
}
