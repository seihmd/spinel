import { ElementBuilderInterface } from './ElementBuilderInterface';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { ElementContext } from '../../element/ElementContext';
import { BranchIndexes } from '../BranchIndexes';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { toInstance } from '../../../util/toInstance';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';
import { PlainEntity } from '../../element/PlainEntity';

export class InstanceElementBuilder implements ElementBuilderInterface {
  createNodeElement(
    term: NodeKeyTerm,
    index: number,
    graphMetadata: GraphMetadata,
    plainEntity: PlainEntity
  ): NodeInstanceElement {
    const nodeMetadata = graphMetadata
      .getGraphNodeMetadata(term.getValue())
      .getEntityMetadata();
    return new NodeInstanceElement(
      toInstance<object>(nodeMetadata.getCstr(), plainEntity.get()),
      graphMetadata.getGraphNodeMetadata(term.getValue()),
      new ElementContext(new BranchIndexes([]), index, false),
      term
    );
  }

  createNodeLabelElement(term: NodeLabelTerm, index: number): NodeLabelElement {
    return new NodeLabelElement(
      term,
      new ElementContext(new BranchIndexes([]), index, false)
    );
  }

  createRelationshipElement(
    term: RelationshipKeyTerm,
    index: number,
    graphMetadata: GraphMetadata,
    plainEntity: PlainEntity
  ): RelationshipInstanceElement {
    const relationshipMetadata = graphMetadata
      .getGraphRelationshipMetadata(term.getValue())
      .getEntityMetadata();
    return new RelationshipInstanceElement(
      toInstance<object>(relationshipMetadata.getCstr(), plainEntity.get()),
      relationshipMetadata,
      new ElementContext(new BranchIndexes([]), index, false),
      term
    );
  }

  createRelationshipTypeElement(
    term: RelationshipTypeTerm,
    index: number
  ): RelationshipTypeElement {
    return new RelationshipTypeElement(
      term,
      new ElementContext(new BranchIndexes([]), index, false)
    );
  }
}
