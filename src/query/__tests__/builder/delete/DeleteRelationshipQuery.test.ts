import 'reflect-metadata';
import { Primary } from '../../../../decorator/property/Primary';
import { getMetadataStore } from '../../../../metadata/store/MetadataStore';
import { RelationshipEntity } from '../../../../decorator/class/RelationshipEntity';
import { DeleteRelationshipQuery } from '../../../builder/delete/DeleteRelationshipQuery';

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
    const deleteQuery = new DeleteRelationshipQuery(
      new Relationship('1'),
      getMetadataStore().getRelationshipEntityMetadata(Relationship)
    );

    expect(deleteQuery.get()).toBe(
      'MATCH ()-[r0:RELATIONSHIP{id:$r0.id}]-() DELETE r0'
    );
  });
});
