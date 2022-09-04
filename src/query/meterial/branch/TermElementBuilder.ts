import { ElementBuilderInterface } from './ElementBuilderInterface';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { NodeElement } from '../../element/NodeElement';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { ElementContext } from '../../element/ElementContext';
import { BranchEndTerm } from '../../../domain/graph/pattern/term/BranchEndTerm';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../../../metadata/schema/entity/RelationshipEntityMetadata';
import { RelationshipElement } from '../../element/RelationshipElement';

export class TermElementBuilder implements ElementBuilderInterface {
  buildNodeElement(
    term: NodeKeyTerm | BranchEndTerm,
    context: ElementContext,
    nodeMetadata: NodeEntityMetadata
  ): NodeElement {
    return new NodeElement(term, nodeMetadata, context);
  }

  buildNodeLabelElement(
    term: NodeLabelTerm,
    context: ElementContext
  ): NodeLabelElement {
    return new NodeLabelElement(term, context);
  }

  buildRelationshipElement(
    term: RelationshipKeyTerm,
    context: ElementContext,
    relationshipMetadata: RelationshipEntityMetadata
  ): RelationshipElement {
    return new RelationshipElement(term, relationshipMetadata, context);
  }

  buildRelationshipTypeElement(
    term: RelationshipTypeTerm,
    context: ElementContext
  ): RelationshipTypeElement {
    return new RelationshipTypeElement(term, context);
  }
}
