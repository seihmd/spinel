import { LEFT, NONE, RIGHT } from '../../Direction';

export abstract class PatternTerm {
  protected constructor(protected readonly value: string) {}

  getValue(): string {
    return this.value;
  }

  abstract getKey(): string | null;

  protected isDirection(): boolean {
    return this.value === LEFT || this.value === NONE || this.value === RIGHT;
  }

  protected throwInvalidValueError(): void {
    throw new Error(`Pattern has invalid value "${this.value}"`);
  }
}
