import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { GraphRelationshipMetadata } from '../../metadata/schema/graph/GraphRelationshipMetadata';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { RelationshipTypeTerm } from '../../domain/graph/pattern/formula/RelationshipTypeTerm';

export class RelationshipElement {
  private readonly term: RelationshipTypeTerm;
  private readonly graphRelationshipMetadata: GraphRelationshipMetadata;

  constructor(
    term: RelationshipTypeTerm,
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
