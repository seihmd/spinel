import { BranchIndexes } from '../../../meterial/BranchIndexes';
import { BranchFilter } from './BranchFilter';

export class BranchFilters {
  constructor(private readonly branchFilters: BranchFilter[] = []) {}

  of(branchIndexes: BranchIndexes | null): BranchFilter | null {
    if (branchIndexes === null) {
      return null;
    }

    return this.branchFilters.find((b) => b.matches(branchIndexes)) ?? null;
  }
}
