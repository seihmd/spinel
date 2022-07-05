import { NodeElement } from './NodeElement';
import { NodeLabelElement } from './NodeLabelElement';
import { RelationshipElement } from './RelationshipElement';
import { RelationshipTypeElement } from './RelationshipTypeElement';
import { DirectionElement } from './DirectionElement';

export type Element = DirectionElement | EntityElement;

export type AnyNodeElement = NodeElement | NodeLabelElement;
export type AnyRelationshipElement =
  | RelationshipElement
  | RelationshipTypeElement;
export type EntityElement = AnyNodeElement | AnyRelationshipElement;

export const isAnyNodeElement = (
  element: Element
): element is AnyNodeElement => {
  return element instanceof NodeElement || element instanceof NodeLabelElement;
};

export const isAnyRelationshipElement = (
  element: Element
): element is AnyRelationshipElement => {
  return (
    element instanceof RelationshipElement ||
    element instanceof RelationshipTypeElement
  );
};
