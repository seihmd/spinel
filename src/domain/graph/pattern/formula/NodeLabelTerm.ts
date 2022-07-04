import { LabelPrefix, PatternTerm } from './PatternTerm';
import { PatternIndex } from './PatternIndex';

export class NodeLabelTerm extends PatternTerm {
  constructor(value: string, index: PatternIndex) {
    super(value, index);

    this.assert();
  }

  getValueWithoutLabelPrefix(): string {
    return this.value.replace(LabelPrefix, '');
  }

  getLabel(): string | null {
    return this.getValueWithoutModifier();
  }

  private assert(): void {
    if (this.isDirection()) {
      throw new Error('Pattern has invalid value');
    }

    if (!this.index.isNode()) {
      throw new Error(`Pattern includes "${this.value}" in wrong place.`);
    }

    if (!this.hasLabelModifier()) {
      throw new Error(`NodeLabelTerm value is not label`);
    }
  }
}
