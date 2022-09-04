import { PositiveInt } from '../../domain/type/PositiveInt';

export class BranchIndex {
  private readonly index: PositiveInt;
  private readonly graphKey: string;
  private readonly subIndex: PositiveInt | null = null;

  constructor(index: number, graphKey: string, subIndex: number | null = null) {
    this.index = new PositiveInt(index);
    this.subIndex = subIndex === null ? null : new PositiveInt(subIndex);
    this.graphKey = graphKey;
  }

  getIndex(): number {
    return this.index.get();
  }

  getSubIndex(): number | null {
    return this.subIndex?.get() ?? null;
  }

  getGraphKey(): string {
    return this.graphKey;
  }
}
