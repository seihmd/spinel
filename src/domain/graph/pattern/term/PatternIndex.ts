export class PatternIndex {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error('index must be an integer ≥ 0');
    }

    this.value = value;
  }

  get(): number {
    return this.value;
  }

  isNode(): boolean {
    return this.value % 4 === 0;
  }

  isRelationship(): boolean {
    return !this.isNode() && this.value % 2 === 0;
  }

  isDirection(): boolean {
    return this.value % 2 !== 0;
  }

  isBetweenNodeAndRelationship(): boolean {
    return this.isDirection() && this.value % 4 === 1;
  }

  isBetweenRelationshipAndNode(): boolean {
    return this.isDirection() && this.value % 4 === 3;
  }
}
