import { RelationshipType } from '../../domain/relationship/RelationshipType';
import { GraphRelationshipMetadata } from '../../metadata/schema/graph/GraphRelationshipMetadata';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { RelationshipEntityMetadata } from '../../metadata/schema/entity/RelationshipEntityMetadata';
import { RelationshipTypeTerm } from '../../domain/graph/pattern/formula/RelationshipTypeTerm';

export class RelationshipElement {
  static new(
    term: RelationshipTypeTerm,
    graphRelationshipMetadata: GraphRelationshipMetadata
  ) {
    return new RelationshipElement(
      term,
      graphRelationshipMetadata,
      getMetadataStore().getRelationshipEntityMetadata(
        graphRelationshipMetadata.getCstr()
      )
    );
  }

  private readonly term: RelationshipTypeTerm;
  private readonly graphRelationshipMetadata: GraphRelationshipMetadata;
  private readonly relationshipEntityMetadata: RelationshipEntityMetadata;

  constructor(
    term: RelationshipTypeTerm,
    graphRelationshipMetadata: GraphRelationshipMetadata,
    relationshipEntityMetadata: RelationshipEntityMetadata
  ) {
    if (term.getValue() !== graphRelationshipMetadata.getKey()) {
      throw new Error();
    }
    if (
      graphRelationshipMetadata.getCstr() !==
      relationshipEntityMetadata.getCstr()
    ) {
      throw new Error();
    }

    this.term = term;
    this.graphRelationshipMetadata = graphRelationshipMetadata;
    this.relationshipEntityMetadata = relationshipEntityMetadata;
  }

  getType(): RelationshipType {
    return this.relationshipEntityMetadata.getType();
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
