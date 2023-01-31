export class NodeLabel {
  private readonly value: string;

  constructor(value: string) {
    if (value.length === 0) {
      throw new Error('Node Label must be at least 1 character');
    }

    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}
