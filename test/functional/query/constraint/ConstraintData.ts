import { Integer } from 'neo4j-driver';
import { ConstraintType } from './ConstraintType';
import { EntityType } from './EntityType';

export type ConstraintData = {
  id: Integer;
  name: string;
  type: ConstraintType | string;
  entityType: EntityType;
  labelsOrTypes: string[];
  properties: string[];
  ownedIndexId: Integer | null;
};
