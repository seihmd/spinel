export class GraphParameterKey {
  private readonly values: string[];

  constructor(value: string) {
    this.assert(value);
    this.values = value.split('.');
  }

  private assert(value: string): void {
    if (!/^(?![0-9.])[a-zA-Z0-9$_.]+$/.test(value)) {
      throw new Error(`Parameter has invalid key: ${value}`);
    }
  }

  getExceptRoot(): string {
    if (this.values.length === 1) {
      return this.values[0];
    }
    return this.values.slice(1).join('.');
  }

  getRoot(): string | null {
    if (this.values.length === 1) {
      return null;
    }

    return this.values[0];
  }

  asPlain(): string {
    return this.values.join('.');
  }

  getValues(): string[] {
    return this.values;
  }
}
