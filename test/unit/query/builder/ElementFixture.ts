import { Direction } from 'domain/graph/Direction';
import { DirectionTerm } from 'domain/graph/pattern/term/DirectionTerm';
import { NodeKeyTerm } from 'domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from 'domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from 'domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from 'domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeLabel } from 'domain/node/NodeLabel';
import { RelationshipType } from 'domain/relationship/RelationshipType';
import { GraphNodeMetadata } from 'metadata/schema/graph/GraphNodeMetadata';
import { GraphRelationshipMetadata } from 'metadata/schema/graph/GraphRelationshipMetadata';
import { DirectionElement } from 'query/element/DirectionElement';
import { ElementContext } from 'query/element/ElementContext';
import { NodeElement } from 'query/element/NodeElement';
import { NodeLabelElement } from 'query/element/NodeLabelElement';
import { RelationshipElement } from 'query/element/RelationshipElement';
import { RelationshipTypeElement } from 'query/element/RelationshipTypeElement';
import { BranchIndexes } from 'query/meterial/BranchIndexes';
import { instance, mock, when } from 'ts-mockito';

export class ElementFixture {
  newNodeElement(label: string, graphKey: string): NodeElement {
    const termStub = mock(NodeKeyTerm);
    when(termStub.getValue()).thenReturn(graphKey);
    const graphNodeMetadataStub = mock(GraphNodeMetadata);
    when(graphNodeMetadataStub.getLabel()).thenReturn(new NodeLabel(label));
    when(graphNodeMetadataStub.getKey()).thenReturn(graphKey);

    return new NodeElement(
      instance(termStub),
      instance(graphNodeMetadataStub),
      new ElementContext(new BranchIndexes([]), 0, false)
    );
  }

  newNodeLabelElement(termValue: string): NodeLabelElement {
    const termStub = new NodeLabelTerm(termValue);

    return new NodeLabelElement(
      termStub,
      new ElementContext(new BranchIndexes([]), 0, false)
    );
  }

  newDirectionElement(direction: Direction): DirectionElement {
    const termStub = mock(DirectionTerm);
    when(termStub.getValue()).thenReturn(direction);
    return new DirectionElement(instance(termStub));
  }

  newRelationshipElement(type: string, graphKey: string): RelationshipElement {
    const termStub = mock(RelationshipKeyTerm);
    when(termStub.getValue()).thenReturn(graphKey);
    const graphRelationshipMetadataStub = mock(GraphRelationshipMetadata);
    when(graphRelationshipMetadataStub.getType()).thenReturn(
      new RelationshipType(type)
    );
    when(graphRelationshipMetadataStub.getKey()).thenReturn(graphKey);

    return new RelationshipElement(
      instance(termStub),
      instance(graphRelationshipMetadataStub),
      new ElementContext(new BranchIndexes([]), 2, false)
    );
  }

  newRelationshipTypeElement(termValue: string): RelationshipTypeElement {
    const term = new RelationshipTypeTerm(termValue);

    return new RelationshipTypeElement(
      term,
      new ElementContext(new BranchIndexes([]), 2, false)
    );
  }
}
