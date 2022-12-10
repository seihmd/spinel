import { NodeEntity } from 'decorator/class/NodeEntity';
import { Primary } from 'decorator/property/Primary';
import { NodeKeyTerm } from 'domain/graph/pattern/term/NodeKeyTerm';
import { getMetadataStore } from 'metadata/store/MetadataStore';
import { DeleteNodeQuery } from 'query/builder/delete/DeleteNodeQuery';
import { ElementContext } from 'query/element/ElementContext';
import { NodeInstanceElement } from 'query/element/NodeInstanceElement';
import { BranchIndexes } from 'query/meterial/BranchIndexes';
import 'reflect-metadata';

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
    const nodeInstanceElement = new NodeInstanceElement(
      new Node('1'),
      getMetadataStore().getNodeEntityMetadata(Node),
      new ElementContext(new BranchIndexes([]), 0, false),
      new NodeKeyTerm('_')
    );
    const deleteQuery = new DeleteNodeQuery(nodeInstanceElement, detach);

    expect(deleteQuery.get()).toBe(expected);
  });
});
