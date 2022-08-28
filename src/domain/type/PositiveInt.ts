export class PositiveInt {
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
}
