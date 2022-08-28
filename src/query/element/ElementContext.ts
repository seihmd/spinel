import { BranchIndexes } from '../meterial/BranchIndexes';
import { PatternIndex } from '../../domain/graph/pattern/term/PatternIndex';

export class ElementContext {
  private readonly branchIndexes: BranchIndexes;
  private readonly patternIndex: PatternIndex;
  private readonly _isOnBranch: boolean;

  constructor(
    branchIndexes: BranchIndexes,
    index: number,
    isOnBranch: boolean
  ) {
    this.branchIndexes = branchIndexes;
    this.patternIndex = new PatternIndex(index);
    this._isOnBranch = isOnBranch;
  }

  getBranchIndexes(): BranchIndexes {
    return this.branchIndexes;
  }

  getIndex(): number {
    return this.patternIndex.get();
  }

  isOnBranch(): boolean {
    return this._isOnBranch;
  }

  equalsBranchIndexes(branchIndexes: BranchIndexes): boolean {
    return this.branchIndexes.equals(branchIndexes);
  }
}
