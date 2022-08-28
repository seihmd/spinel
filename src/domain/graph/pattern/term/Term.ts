import { NodeLabelTerm } from './NodeLabelTerm';
import { NodeKeyTerm } from './NodeKeyTerm';
import { RelationshipTypeTerm } from './RelationshipTypeTerm';
import { RelationshipKeyTerm } from './RelationshipKeyTerm';
import { DirectionTerm } from './DirectionTerm';
import { BranchEndTerm } from './BranchEndTerm';

export type NodeTerm = NodeLabelTerm | NodeKeyTerm;
export type RelationshipTerm = RelationshipTypeTerm | RelationshipKeyTerm;
export type Term = NodeTerm | RelationshipTerm | DirectionTerm | BranchEndTerm;

export function isEntityKeyTerm(
  term: Term
): term is NodeKeyTerm | RelationshipKeyTerm {
  return term instanceof NodeKeyTerm || term instanceof RelationshipKeyTerm;
}

export function isDirectionTerm(term: Term): term is DirectionTerm {
  return term instanceof DirectionTerm;
}
