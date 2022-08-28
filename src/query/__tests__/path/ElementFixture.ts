import { NodeElement } from '../../element/NodeElement';
import { instance, mock, when } from 'ts-mockito';
import { GraphNodeMetadata } from '../../../metadata/schema/graph/GraphNodeMetadata';
import { DirectionElement } from '../../element/DirectionElement';
import { Direction } from '../../../domain/graph/Direction';
import { RelationshipElement } from '../../element/RelationshipElement';
import { GraphRelationshipMetadata } from '../../../metadata/schema/graph/GraphRelationshipMetadata';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { ElementContext } from '../../element/ElementContext';

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
