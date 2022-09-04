import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeElement } from '../../element/NodeElement';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipElement } from '../../element/RelationshipElement';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';
import { ElementContext } from '../../element/ElementContext';
import { BranchEndTerm } from '../../../domain/graph/pattern/term/BranchEndTerm';
import { RelationshipEntityMetadata } from '../../../metadata/schema/entity/RelationshipEntityMetadata';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { PlainEntity } from '../../element/PlainEntity';

export interface ElementBuilderInterface {
  buildNodeElement(
    term: NodeKeyTerm | BranchEndTerm,
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
