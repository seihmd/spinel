import { PatternIndex } from './PatternIndex';
import { LEFT, NONE, RIGHT } from '../../Direction';

export const LabelPrefix = ':';

export abstract class PatternTerm {
  protected readonly value: string;
  protected readonly index: PatternIndex;

  protected constructor(value: string, index: PatternIndex) {
    this.value = value;
    this.index = index;
  }

  getValue(): string {
    return this.value;
  }

  getValueWithoutModifier() {
    return this.value.replace(LabelPrefix, '').replace(/@.+$/, '');
  }

  getIndex(): PatternIndex {
    return this.index;
  }

  protected isDirection(): boolean {
    return this.value === LEFT || this.value === NONE || this.value === RIGHT;
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
}
