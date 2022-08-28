import { LabelPrefix, PatternTerm } from './PatternTerm';

export class NodeLabelTerm extends PatternTerm {
  constructor(value: string) {
    super(value);

    this.assert();
  }

  getValueWithoutLabelPrefix(): string {
    return this.value.replace(LabelPrefix, '');
  }

  getLabel(): string | null {
    return this.getValueWithoutModifier();
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
