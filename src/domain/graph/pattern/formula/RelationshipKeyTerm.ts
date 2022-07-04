import { PatternTerm } from './PatternTerm';
import { PatternIndex } from './PatternIndex';

export class RelationshipKeyTerm extends PatternTerm {
  constructor(value: string, index: PatternIndex) {
    super(value, index);

    this.assert();
  }

  private assert(): void {
    if (this.isDirection()) {
      throw new Error('Pattern has invalid value');
    }

    if (!this.index.isRelationship()) {
      throw new Error(`Pattern includes "${this.value}" in wrong place.`);
    }

    if (this.hasModifier()) {
      throw new Error(`Pattern has invalid value.`);
    }
  }
}
