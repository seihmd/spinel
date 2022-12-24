import { RelationshipType } from '../../../relationship/RelationshipType';
import { LABEL_PREFIX } from './modifiers';
import { PatternTerm } from './PatternTerm';

export class RelationshipTypeTerm extends PatternTerm {
  static withRelationshipType(
    relationshipType: RelationshipType
  ): RelationshipTypeTerm {
    return new RelationshipTypeTerm(`:${relationshipType.toString()}`);
  }

  constructor(value: string) {
    super(value);

    this.assert();
  }

  getValueWithoutLabelPrefix(): string {
    return this.value.replace(LABEL_PREFIX, '');
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
