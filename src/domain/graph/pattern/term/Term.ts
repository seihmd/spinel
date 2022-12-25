import { AssociationReferenceTerm } from './AssociationReferenceTerm';
import { DirectionTerm } from './DirectionTerm';
import { NodeKeyTerm } from './NodeKeyTerm';
import { NodeLabelTerm } from './NodeLabelTerm';
import { RelationshipKeyTerm } from './RelationshipKeyTerm';
import { RelationshipTypeTerm } from './RelationshipTypeTerm';

export type NodeTerm = NodeLabelTerm | NodeKeyTerm;
export type RelationshipTerm = RelationshipTypeTerm | RelationshipKeyTerm;
export type ReferenceTerm = AssociationReferenceTerm;
export type Term = NodeTerm | RelationshipTerm | DirectionTerm | ReferenceTerm;

export function isEntityKeyTerm(
  term: Term
): term is NodeKeyTerm | RelationshipKeyTerm {
  return term instanceof NodeKeyTerm || term instanceof RelationshipKeyTerm;
}

export function isDirectionTerm(term: Term): term is DirectionTerm {
  return term instanceof DirectionTerm;
}
