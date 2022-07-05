import { NodeElement } from '../../element/NodeElement';
import { instance, mock, when } from 'ts-mockito';
import { NodeKeyTerm } from '../../../domain/graph/pattern/formula/NodeKeyTerm';
import { GraphNodeMetadata } from '../../../metadata/schema/graph/GraphNodeMetadata';
import { PatternIndex } from '../../../domain/graph/pattern/formula/PatternIndex';
import { DirectionElement } from '../../element/DirectionElement';
import { Direction } from '../../../domain/graph/Direction';
import { DirectionTerm } from '../../../domain/graph/pattern/formula/DirectionTerm';
import { RelationshipElement } from '../../element/RelationshipElement';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/formula/RelationshipKeyTerm';
import { GraphRelationshipMetadata } from '../../../metadata/schema/graph/GraphRelationshipMetadata';

export class ElementFixture {
  private index = 0;

  reIndex(index = 0): this {
    this.index = index;

    return this;
  }

  newNodeElement(): NodeElement {
    const term = mock(NodeKeyTerm);
    when(term.getIndex()).thenReturn(new PatternIndex(this.index++));
    const graphNodeMetadata = mock(GraphNodeMetadata);
    return new NodeElement(instance(term), instance(graphNodeMetadata));
  }

  newDirectionElement(direction: Direction): DirectionElement {
    const term = mock(DirectionTerm);
    when(term.getIndex()).thenReturn(new PatternIndex(this.index++));
    when(term.getValue()).thenReturn(direction);
    return new DirectionElement(instance(term));
  }

  newRelationshipElement(): RelationshipElement {
    const term = mock(RelationshipKeyTerm);
    when(term.getIndex()).thenReturn(new PatternIndex(this.index++));
    const graphRelationshipMetadata = mock(GraphRelationshipMetadata);

    return new RelationshipElement(
      instance(term),
      instance(graphRelationshipMetadata)
    );
  }
}
