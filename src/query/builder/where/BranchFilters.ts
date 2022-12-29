import { BranchIndexes } from '../../meterial/BranchIndexes';
import { BranchFilter } from './BranchFilter';

export class BranchFilters {
  private readonly whereQueries: BranchFilter[] = [];

  constructor(whereQueries: BranchFilter[]) {
    this.whereQueries = whereQueries;
  }

  add(whereQuery: BranchFilter): BranchFilters {
    return new BranchFilters([...this.whereQueries, whereQuery]);
  }

  ofStem(): BranchFilter | null {
    return this.of(null);
  }

  of(branchIndexes: BranchIndexes | null): BranchFilter | null {
    const key = branchIndexes ? branchIndexes.getGraphKeys().join('.') : null;
    if (key === null) {
      return null;
    }

    for (const whereQuery of this.whereQueries) {
      if (whereQuery.matches(key)) {
        return whereQuery;
      }
    }
    return null;
  }
}
