import 'reflect-metadata';
import { Primary } from '../../../../decorator/property/Primary';
import { getMetadataStore } from '../../../../metadata/store/MetadataStore';
import { RelationshipEntity } from '../../../../decorator/class/RelationshipEntity';
import { DeleteRelationshipQuery } from '../../../builder/delete/DeleteRelationshipQuery';
import { RelationshipInstanceElement } from '../../../element/RelationshipInstanceElement';
import { BranchIndexes } from '../../../meterial/BranchIndexes';
import { RelationshipKeyTerm } from '../../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { ElementContext } from '../../../element/ElementContext';

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
