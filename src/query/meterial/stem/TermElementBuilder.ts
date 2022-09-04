import { ElementBuilderInterface } from './ElementBuilderInterface';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipElement } from '../../element/RelationshipElement';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { NodeElement } from '../../element/NodeElement';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { ElementContext } from '../../element/ElementContext';
import { BranchIndexes } from '../BranchIndexes';

export class TermElementBuilder implements ElementBuilderInterface {
  createNodeElement(
    term: NodeKeyTerm,
    index: number,
    graphMetadata: GraphMetadata
  ): NodeElement {
    return new NodeElement(
      term,
      graphMetadata.getGraphNodeMetadata(term.getValue()),
      new ElementContext(new BranchIndexes([]), index, false)
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
    graphMetadata: GraphMetadata
  ): RelationshipElement {
    return new RelationshipElement(
      term,
      graphMetadata.getGraphRelationshipMetadata(term.getValue()),
      new ElementContext(new BranchIndexes([]), index, false)
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
