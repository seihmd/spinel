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
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { PlainEntity } from '../../element/PlainEntity';

export interface ElementBuilderInterface {
  createNodeElement(
    term: NodeKeyTerm,
    index: number,
    graphMetadata: GraphMetadata,
    plainEntity?: PlainEntity
  ): NodeElement | NodeInstanceElement;

  createNodeLabelElement(term: NodeLabelTerm, index: number): NodeLabelElement;

  createRelationshipElement(
    term: RelationshipKeyTerm,
    index: number,
    graphMetadata: GraphMetadata,
    plainEntity?: PlainEntity
  ): RelationshipElement | RelationshipInstanceElement;

  createRelationshipTypeElement(
    term: RelationshipTypeTerm,
    index: number
  ): RelationshipTypeElement;
}
