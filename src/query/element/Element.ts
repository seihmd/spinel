import { NodeElement } from './NodeElement';
import { NodeLabelElement } from './NodeLabelElement';
import { RelationshipElement } from './RelationshipElement';
import { RelationshipTypeElement } from './RelationshipTypeElement';
import { DirectionElement } from './DirectionElement';

export type Element = DirectionElement | EntityElement;

export type EntityElement =
  | NodeElement
  | NodeLabelElement
  | RelationshipElement
  | RelationshipTypeElement;
