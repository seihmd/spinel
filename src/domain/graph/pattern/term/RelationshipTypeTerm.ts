import { LabelPrefix, PatternTerm } from './PatternTerm';

export class RelationshipTypeTerm extends PatternTerm {
  constructor(value: string) {
    super(value);

    this.assert();
  }

  getValueWithoutLabelPrefix(): string {
    return this.value.replace(LabelPrefix, '');
  }

  getKey(): string | null {
    return this.getParameterModifier();
  }

  private assert(): void {
    if (this.isDirection() || this.isBranchEnd() || !this.hasLabelModifier()) {
      this.throwInvalidValueError();
    }
  }
}
