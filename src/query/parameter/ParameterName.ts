const SEPARATOR = '.';

export class ParameterName {
  private readonly values: string[];

  constructor(value: string) {
    const values = value.split(SEPARATOR);
    this.assert(values);

    this.values = values;
  }

  private assert(values: string[]): void {
    values.forEach((value) => {
      if (value.length === 0) {
        throw new Error(`Invalid ParameterName "${values.join(SEPARATOR)}"`);
      }
    });
  }

  get(): string {
    return this.values.join(SEPARATOR);
  }

  getPropertyName(): string {
    return this.values[this.values.length - 1];
  }

  getSplit(): string[] {
    return this.values;
  }
}
