import { RelationshipTypeTerm } from '../../domain/graph/pattern/formula/RelationshipTypeTerm';
import { RelationshipType } from '../../domain/relationship/RelationshipType';

export class RelationshipTypeElement {
  private readonly term: RelationshipTypeTerm;

  constructor(term: RelationshipTypeTerm) {
    this.term = term;
  }

  getType(): RelationshipType {
    return new RelationshipType(this.term.getValueWithoutModifier());
  }

  getGraphKey(): string {
    return '';
  }

  getGraphParameterKey(): string | null {
    const parameterModifier = this.term.getParameterModifier();
    if (parameterModifier !== null) {
      return parameterModifier;
    }
    return null;
  }
}
