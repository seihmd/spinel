import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { GraphRelationshipMetadata } from '../../metadata/schema/graph/GraphRelationshipMetadata';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { RelationshipKeyTerm } from '../../domain/graph/pattern/formula/RelationshipKeyTerm';

export class RelationshipElement {
  private readonly term: RelationshipKeyTerm;
  private readonly graphRelationshipMetadata: GraphRelationshipMetadata;

  constructor(
    term: RelationshipKeyTerm,
    graphRelationshipMetadata: GraphRelationshipMetadata
  ) {
    if (term.getValue() !== graphRelationshipMetadata.getKey()) {
      throw new Error();
    }

    this.term = term;
    this.graphRelationshipMetadata = graphRelationshipMetadata;
  }

  getType(): RelationshipType {
    return this.graphRelationshipMetadata.getType();
  }

  getCstr(): AnyClassConstructor {
    return this.graphRelationshipMetadata.getCstr();
  }

  getGraphKey(): string {
    return this.term.getValue();
  }

  getGraphParameterKey(): string {
    return this.term.getValue();
  }
}
