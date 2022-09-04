import { NodeElement } from './NodeElement';
import { NodeLabelElement } from './NodeLabelElement';
import { RelationshipElement } from './RelationshipElement';
import { RelationshipTypeElement } from './RelationshipTypeElement';
import { DirectionElement } from './DirectionElement';
import { NodeInstanceElement } from './NodeInstanceElement';
import { RelationshipInstanceElement } from './RelationshipInstanceElement';

export type Element = DirectionElement | EntityElement | InstanceElement;

export type AnyNodeElement =
  | NodeElement
  | NodeLabelElement
  | NodeInstanceElement;
export type AnyRelationshipElement =
  | RelationshipElement
  | RelationshipTypeElement
  | RelationshipInstanceElement;
export type EntityElement = AnyNodeElement | AnyRelationshipElement;
export type InstanceElement = NodeInstanceElement | RelationshipInstanceElement;

export const isAnyNodeElement = (
  element: Element
): element is AnyNodeElement => {
  return (
    element instanceof NodeElement ||
    element instanceof NodeLabelElement ||
    element instanceof NodeInstanceElement
  );
};

export const isAnyRelationshipElement = (
  element: Element
): element is AnyRelationshipElement => {
  return (
    element instanceof RelationshipElement ||
    element instanceof RelationshipTypeElement ||
    element instanceof RelationshipInstanceElement
  );
};

export const isInstanceElement = (
  element: Element
): element is InstanceElement => {
  return (
    element instanceof NodeInstanceElement ||
    element instanceof RelationshipInstanceElement
  );
};
