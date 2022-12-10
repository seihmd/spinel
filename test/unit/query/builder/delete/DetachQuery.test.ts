import { NodeEntity } from 'decorator/class/NodeEntity';
import { RelationshipEntity } from 'decorator/class/RelationshipEntity';
import { Primary } from 'decorator/property/Primary';
import { NodeKeyTerm } from 'domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from 'domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from 'domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeLabel } from 'domain/node/NodeLabel';
import { RelationshipType } from 'domain/relationship/RelationshipType';
import { getMetadataStore } from 'metadata/store/MetadataStore';
import { DetachQuery } from 'query/builder/delete/DetachQuery';
import { ElementContext } from 'query/element/ElementContext';
import { NodeInstanceElement } from 'query/element/NodeInstanceElement';
import { NodeLabelElement } from 'query/element/NodeLabelElement';
import { RelationshipTypeElement } from 'query/element/RelationshipTypeElement';
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

@RelationshipEntity()
class Relationship {
  @Primary()
  private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

function createNodeInstanceElement(index: number): NodeInstanceElement {
  return new NodeInstanceElement(
    new Node('_'),
    getMetadataStore().getNodeEntityMetadata(Node),
    new ElementContext(new BranchIndexes([]), index, false),
    new NodeKeyTerm('_')
  );
}

function createNodeLabelElement(
  nodeLabel: NodeLabel,
  index: number
): NodeLabelElement {
  return new NodeLabelElement(
    NodeLabelTerm.withNodeLabel(nodeLabel),
    new ElementContext(new BranchIndexes([]), index, false)
  );
}

function createRelationshipTypeElement(
  relationshipType: RelationshipType,
  index: number
): RelationshipTypeElement {
  return new RelationshipTypeElement(
    RelationshipTypeTerm.withRelationshipType(relationshipType),
    new ElementContext(new BranchIndexes([]), index, false)
  );
}

describe(`${DetachQuery.name}`, () => {
  test('detach between node instances', () => {
    const detachQuery = new DetachQuery(
      createNodeInstanceElement(0),
      createRelationshipTypeElement(new RelationshipType('HAS'), 2),
      createNodeInstanceElement(4),
      '->'
    );

    expect(detachQuery.get()).toBe(
      'MATCH (n0:Node)-[r2:HAS]->(n4:Node) DELETE r2'
    );
  });

  test('detach between node labels', () => {
    const detachQuery = new DetachQuery(
      createNodeLabelElement(new NodeLabel('Shop'), 0),
      createRelationshipTypeElement(new RelationshipType('HAS'), 2),
      createNodeLabelElement(new NodeLabel('Item'), 4),
      '->'
    );

    expect(detachQuery.get()).toBe(
      'MATCH (n0:Shop)-[r2:HAS]->(n4:Item) DELETE r2'
    );
  });
});
