import { BranchIndex } from './BranchIndex';

export class BranchIndexes {
  private readonly branchIndexes: BranchIndex[];

  constructor(indexes: BranchIndex[]) {
    this.branchIndexes = indexes;
  }

  append(index: number, graphKey: string): BranchIndexes {
    return new BranchIndexes([
      ...this.branchIndexes,
      new BranchIndex(index, graphKey),
    ]);
  }

  isStem(): boolean {
    return this.branchIndexes.length === 0;
  }

  getIndexes(): number[] {
    return this.branchIndexes.map((b) => b.getIndex());
  }

  getGraphKeys(): string[] {
    return this.branchIndexes.map((b) => b.getGraphKey());
  }

  reduce(): BranchIndexes {
    if (!this.canReduce()) {
      throw new Error('Cannot reduce');
    }

    return new BranchIndexes(this.branchIndexes.slice(0, -1));
  }

  equals(another: BranchIndexes) {
    return (
      this.branchIndexes.length === another.branchIndexes.length &&
      this.branchIndexes.every(
        (b, i) =>
          b.getIndex() === another.branchIndexes[i].getIndex() &&
          b.getGraphKey() === another.branchIndexes[i].getGraphKey()
      )
    );
  }

  equalsStem(another: BranchIndexes): boolean {
    if (!this.canReduce()) {
      return false;
    }

    return this.reduce().equals(another);
  }

  private canReduce(): boolean {
    return this.branchIndexes.length > 0;
  }
}
