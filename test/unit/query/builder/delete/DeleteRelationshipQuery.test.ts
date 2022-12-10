import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { Primary } from 'decorator/property/Primary';
import { RelationshipKeyTerm } from 'domain/graph/pattern/term/RelationshipKeyTerm';
import { getMetadataStore } from 'metadata/store/MetadataStore';
import { DeleteRelationshipQuery } from 'query/builder/delete/DeleteRelationshipQuery';
import { ElementContext } from 'query/element/ElementContext';
import { RelationshipInstanceElement } from 'query/element/RelationshipInstanceElement';
import { BranchIndexes } from 'query/meterial/BranchIndexes';
import 'reflect-metadata';

@RelationshipEntity()
class Relationship {
  @Primary()
  private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

describe(`${DeleteRelationshipQuery.name}`, () => {
  test('get', () => {
    const relationshipInstanceElement = new RelationshipInstanceElement(
      new Relationship('1'),
      getMetadataStore().getRelationshipEntityMetadata(Relationship),
      new ElementContext(new BranchIndexes([]), 0, false),
      new RelationshipKeyTerm('r')
    );

    const deleteQuery = new DeleteRelationshipQuery(
      relationshipInstanceElement
    );

    expect(deleteQuery.get()).toBe(
      'MATCH ()-[r0:RELATIONSHIP{id:$r0.id}]-() DELETE r0'
    );
  });
});
