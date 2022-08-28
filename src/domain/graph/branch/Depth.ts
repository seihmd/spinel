const defaultDepth = 1;

const DEFAULT = 2;
const MIN = 0;

export class Depth {
  static withDefault(): Depth {
    return new Depth(DEFAULT);
  }

  private readonly level: number;

  constructor(value = defaultDepth) {
    this.assert(value);
    this.level = value;
  }

  private assert(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('GraphBranch depth must be integer');
    }
    if (value < MIN) {
      throw new Error(`GraphBranch depth must be >= ${MIN}`);
    }
  }

  get(): number {
    return this.level;
  }

  canReduce(): boolean {
    return this.level > MIN;
  }

  reduce(): Depth {
    if (!this.canReduce()) {
      throw new Error('Depth cannot be reduced < 0');
    }
    return new Depth(this.level - 1);
  }
}
