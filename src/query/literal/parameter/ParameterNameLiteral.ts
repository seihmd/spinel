export class ParameterNameLiteral {
  private readonly value: string;

  constructor(value: string) {
    if (value.length === 0) {
      throw new Error('ParameterNameLiteral must be at least 1 character');
    }
    this.value = value;
  }

  $(): string {
    return '$' + this.get();
  }

  get(): string {
    return this.value;
  }
}
