const defaultDepth = 1;

export class Depth {
  private readonly value: number;

  constructor(value = defaultDepth) {
    this.assert(value);
    this.value = value;
  }

  private assert(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('GraphBranch depth must be integer');
    }
    if (value < 1) {
      throw new Error('GraphBranch depth must be >= 1');
    }
  }

  get(): number {
    return this.value;
  }
}
