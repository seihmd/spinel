import { PositiveInt } from '../../domain/type/PositiveInt';

export class BranchIndex {
  private readonly index: PositiveInt;
  private readonly graphKey: string;

  constructor(index: number, graphKey: string) {
    this.index = new PositiveInt(index);
    this.graphKey = graphKey;
  }

  getIndex(): number {
    return this.index.get();
  }

  getGraphKey(): string {
    return this.graphKey;
  }
}
