import { LabelPrefix, PatternTerm } from './PatternTerm';
import { RelationshipType } from '../../../relationship/RelationshipType';

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
