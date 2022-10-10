import { NodeLabel } from '../../../../src/domain/node/NodeLabel';
import { RelationshipType } from '../../../../src/domain/relationship/RelationshipType';

export interface ConstraintInterface {
  getProperties(): string[];

  getName(): string;

  getLabelOrType(): NodeLabel | RelationshipType;

  getRequire(): string;
}
