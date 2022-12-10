import { Direction } from 'domain/graph/Direction';
import { DirectionTerm } from 'domain/graph/pattern/term/DirectionTerm';
import { NodeKeyTerm } from 'domain/graph/pattern/term/NodeKeyTerm';
import { RelationshipKeyTerm } from 'domain/graph/pattern/term/RelationshipKeyTerm';
import { GraphNodeMetadata } from 'metadata/schema/graph/GraphNodeMetadata';
import { GraphRelationshipMetadata } from 'metadata/schema/graph/GraphRelationshipMetadata';
import { DirectionElement } from 'query/element/DirectionElement';
import { ElementContext } from 'query/element/ElementContext';
import { NodeElement } from 'query/element/NodeElement';
import { RelationshipElement } from 'query/element/RelationshipElement';
import { BranchIndexes } from 'query/meterial/BranchIndexes';
import { instance, mock, when } from 'ts-mockito';

export class ElementFixture {
  newNodeElement(): NodeElement {
    const term = mock(NodeKeyTerm);
    const graphNodeMetadata = mock(GraphNodeMetadata);
    return new NodeElement(
      instance(term),
      instance(graphNodeMetadata),
      new ElementContext(new BranchIndexes([]), 0, false)
    );
  }

  newDirectionElement(direction: Direction): DirectionElement {
    const term = mock(DirectionTerm);
    when(term.getValue()).thenReturn(direction);
    return new DirectionElement(instance(term));
  }

  newRelationshipElement(): RelationshipElement {
    const term = mock(RelationshipKeyTerm);
    const graphRelationshipMetadata = mock(GraphRelationshipMetadata);

    return new RelationshipElement(
      instance(term),
      instance(graphRelationshipMetadata),
      new ElementContext(new BranchIndexes([]), 0, false)
    );
  }
}
