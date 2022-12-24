import { ALIAS, BRANCH_END, LABEL_PREFIX } from './modifiers';
import { PatternTerm } from './PatternTerm';

export abstract class EntityTerm extends PatternTerm {
  getValueWithoutModifier() {
    return this.value
      .replace(LABEL_PREFIX, '')
      .replace(new RegExp(`${ALIAS}.+$`), '');
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

  protected hasAlias(): boolean {
    return this.hasLabelModifier() || this.hasParameterModifier();
  }

  protected hasLabelModifier(): boolean {
    return this.value.startsWith(LABEL_PREFIX);
  }
}
