import { BranchIndexes } from '../meterial/BranchIndexes';

export class BranchIndexesLiteral {
  private readonly branchIndexes: BranchIndexes;

  constructor(branchIndexes: BranchIndexes) {
    this.branchIndexes = branchIndexes;
  }

  get(): string {
    if (this.branchIndexes.size() === 0) {
      return '';
    }

    return (
      this.branchIndexes
        .map((branchIndex) => {
          const subIndex = branchIndex.getSubIndex();

          return `b${branchIndex.getIndex()}${
            subIndex === null ? '' : `_${subIndex}`
          }`;
        })
        .join('_') + '_'
    );
  }
}
