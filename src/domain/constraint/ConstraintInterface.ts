import { NodeLabel } from '../../domain/node/NodeLabel';
import { RelationshipType } from '../../domain/relationship/RelationshipType';

export interface ConstraintInterface {
  getProperties(): string[];

  getName(): string;

  getLabelOrType(): NodeLabel | RelationshipType;

  getRequire(): string;
}
