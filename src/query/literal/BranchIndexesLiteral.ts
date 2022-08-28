import { BranchIndexes } from '../meterial/BranchIndexes';

export class BranchIndexesLiteral {
  private readonly branchIndexes: BranchIndexes;

  constructor(branchIndexes: BranchIndexes) {
    this.branchIndexes = branchIndexes;
  }

  get(): string {
    const indexes = this.branchIndexes.getIndexes();
    if (indexes.length === 0) {
      return '';
    }
    return (
      indexes
        .map((index) => {
          return `b${index.toString()}`;
        })
        .join('_') + '_'
    );
  }
}
