import 'reflect-metadata';
import { DeleteNodeQuery } from '../../../builder/delete/DeleteNodeQuery';
import { NodeEntity } from '../../../../decorator/class/NodeEntity';
import { Primary } from '../../../../decorator/property/Primary';
import { getMetadataStore } from '../../../../metadata/store/MetadataStore';
import { NodeInstanceElement } from '../../../element/NodeInstanceElement';
import { ElementContext } from '../../../element/ElementContext';
import { BranchIndexes } from '../../../meterial/BranchIndexes';
import { NodeKeyTerm } from '../../../../domain/graph/pattern/term/NodeKeyTerm';

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
