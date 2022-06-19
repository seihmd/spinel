export class Alias {
  private readonly value: string;

  constructor(value: string) {
    this.assert(value);
    this.value = value;
  }

  get(): string {
    return this.value;
  }

  private assert(value: string) {
    if (!/^(?![0-9])[a-zA-Z0-9$_]+$/.test(value)) {
      throw new Error(`"${value}" is invalid for alias`);
    }
  }
}
