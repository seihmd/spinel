import { AssociationReferenceTerm } from '../../../domain/graph/pattern/term/AssociationReferenceTerm';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../../../metadata/schema/entity/RelationshipEntityMetadata';
import { ElementContext } from '../../element/ElementContext';
import { NodeElement } from '../../element/NodeElement';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { RelationshipElement } from '../../element/RelationshipElement';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { ElementBuilderInterface } from './ElementBuilderInterface';

export class TermElementBuilder implements ElementBuilderInterface {
  buildNodeElement(
    term: NodeKeyTerm | AssociationReferenceTerm,
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
