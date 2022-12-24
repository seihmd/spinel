import { LEFT, NONE, RIGHT } from '../../Direction';
import { ALIAS, BRANCH_END, LABEL_PREFIX } from './modifiers';

export abstract class PatternTerm {
  protected readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  getValueWithoutModifier() {
    return this.value
      .replace(LABEL_PREFIX, '')
      .replace(new RegExp(`${ALIAS}.+$`), '');
  }

  abstract getKey(): string | null;

  protected isDirection(): boolean {
    return this.value === LEFT || this.value === NONE || this.value === RIGHT;
  }

  protected isBranchEnd(): boolean {
    return this.value.startsWith(BRANCH_END);
  }

  protected hasParameterModifier(): boolean {
    return this.value.includes(ALIAS);
  }

  getParameterModifier(): string | null {
    if (this.hasParameterModifier()) {
      return this.value.replace(new RegExp(`^.+${ALIAS}`), '');
    }

    return null;
  }

  protected hasModifier(): boolean {
    return this.hasLabelModifier() || this.hasParameterModifier();
  }

  protected hasLabelModifier(): boolean {
    return this.value.startsWith(LABEL_PREFIX);
  }

  protected throwInvalidValueError(): void {
    throw new Error(`Pattern has invalid value "${this.value}"`);
  }
}
