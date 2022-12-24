import { AssociationReferenceTerm } from '../../../domain/graph/pattern/term/AssociationReferenceTerm';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../../../metadata/schema/entity/RelationshipEntityMetadata';
import { ElementContext } from '../../element/ElementContext';
import { NodeElement } from '../../element/NodeElement';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { PlainEntity } from '../../element/PlainEntity';
import { RelationshipElement } from '../../element/RelationshipElement';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';

export interface ElementBuilderInterface {
  buildNodeElement(
    term: NodeKeyTerm | AssociationReferenceTerm,
    context: ElementContext,
    nodeMetadata: NodeEntityMetadata,
    instance?: PlainEntity
  ): NodeElement | NodeInstanceElement;

  buildNodeLabelElement(
    term: NodeLabelTerm,
    context: ElementContext
  ): NodeLabelElement;

  buildRelationshipElement(
    term: RelationshipKeyTerm,
    context: ElementContext,
    relationshipMetadata: RelationshipEntityMetadata,
    instance?: PlainEntity
  ): RelationshipElement | RelationshipInstanceElement;

  buildRelationshipTypeElement(
    term: RelationshipTypeTerm,
    context: ElementContext
  ): RelationshipTypeElement;
}
