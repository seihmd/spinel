import { LEFT, NONE, RIGHT } from '../../Direction';

export const LabelPrefix = ':';
export const BRANCH_END = '*';

export abstract class PatternTerm {
  protected readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  getValueWithoutModifier() {
    return this.value.replace(LabelPrefix, '').replace(/@.+$/, '');
  }

  abstract getKey(): string | null;

  protected isDirection(): boolean {
    return this.value === LEFT || this.value === NONE || this.value === RIGHT;
  }

  protected isBranchEnd(): boolean {
    return this.value.startsWith(BRANCH_END);
  }

  protected hasParameterModifier(): boolean {
    return this.value.includes('@');
  }

  getParameterModifier(): string | null {
    if (this.hasParameterModifier()) {
      return this.value.replace(/^.+@/, '');
    }

    return null;
  }

  protected hasModifier(): boolean {
    return this.hasLabelModifier() || this.hasParameterModifier();
  }

  protected hasLabelModifier(): boolean {
    return this.value.startsWith(LabelPrefix);
  }

  protected throwInvalidValueError(): void {
    throw new Error(`Pattern has invalid value "${this.value}"`);
  }
}
