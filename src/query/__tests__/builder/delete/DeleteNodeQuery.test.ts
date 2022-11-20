import 'reflect-metadata';
import { DeleteNodeQuery } from '../../../builder/delete/DeleteNodeQuery';
import { NodeEntity } from '../../../../decorator/class/NodeEntity';
import { Primary } from '../../../../decorator/property/Primary';
import { getMetadataStore } from '../../../../metadata/store/MetadataStore';

@NodeEntity()
class Node {
  @Primary()
  private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

describe(`${DeleteNodeQuery.name}`, () => {
  test.each([
    [true, 'MATCH (n0:Node{id:$n0.id}) DETACH DELETE n0'],
    [false, 'MATCH (n0:Node{id:$n0.id}) DELETE n0'],
  ])('get', (detach: boolean, expected: string) => {
    const deleteQuery = new DeleteNodeQuery(
      new Node('1'),
      getMetadataStore().getNodeEntityMetadata(Node),
      detach
    );

    expect(deleteQuery.get()).toBe(expected);
  });
});
