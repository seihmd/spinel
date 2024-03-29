import { AssociationReferenceTerm } from '../../../domain/graph/pattern/term/AssociationReferenceTerm';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from '../../../domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from '../../../domain/graph/pattern/term/RelationshipTypeTerm';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../../../metadata/schema/entity/RelationshipEntityMetadata';
import { toInstance } from '../../../util/toInstance';
import { ElementContext } from '../../element/ElementContext';
import { NodeElement } from '../../element/NodeElement';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { NodeLabelElement } from '../../element/NodeLabelElement';
import { PlainEntity } from '../../element/PlainEntity';
import { RelationshipInstanceElement } from '../../element/RelationshipInstanceElement';
import { RelationshipTypeElement } from '../../element/RelationshipTypeElement';
import { ElementBuilderInterface } from './ElementBuilderInterface';

export class InstanceElementBuilder implements ElementBuilderInterface {
  buildNodeElement(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    term: NodeKeyTerm | AssociationReferenceTerm,
    context: ElementContext,
    nodeMetadata: NodeEntityMetadata,
    plainEntity: PlainEntity
  ): NodeElement | NodeInstanceElement {
    return new NodeInstanceElement(
      toInstance<object>(nodeMetadata.getCstr(), plainEntity.get()),
      nodeMetadata,
      context,
      term
    );
  }

  buildNodeLabelElement(
    term: NodeLabelTerm,
    context: ElementContext
  ): NodeLabelElement {
    return new NodeLabelElement(term, context);
  }

  buildRelationshipElement(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    term: RelationshipKeyTerm,
    context: ElementContext,
    relationshipMetadata: RelationshipEntityMetadata,
    plainEntity: PlainEntity
  ): RelationshipInstanceElement {
    return new RelationshipInstanceElement(
      toInstance<object>(relationshipMetadata.getCstr(), plainEntity.get()),
      relationshipMetadata,
      context,
      term
    );
  }

  buildRelationshipTypeElement(
    term: RelationshipTypeTerm,
    context: ElementContext
  ): RelationshipTypeElement {
    return new RelationshipTypeElement(term, context);
  }
}
