import { LabelPrefix, PatternTerm } from './PatternTerm';
import { PatternIndex } from './PatternIndex';

export class RelationshipTypeTerm extends PatternTerm {
  constructor(value: string, index: PatternIndex) {
    super(value, index);

    this.assert();
  }

  getValueWithoutLabelPrefix(): string {
    return this.value.replace(LabelPrefix, '');
  }

  private assert(): void {
    if (this.isDirection()) {
      throw new Error('Pattern has invalid value');
    }

    if (!this.index.isRelationship()) {
      throw new Error(`Pattern includes "${this.value}" in wrong place.`);
    }

    if (!this.hasLabelModifier()) {
      throw new Error(`RelationshipTypeTerm value is not type`);
    }
  }
}
