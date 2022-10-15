import { ConstraintData } from '../ConstraintData';
import { Integer } from 'neo4j-driver';

export const nodeKeyConstraintData: ConstraintData = {
  id: Integer.fromValue(1),
  name: 'node_key_constraint_name',
  type: 'NODE_KEY',
  entityType: 'NODE',
  labelsOrTypes: ['Customer'],
  properties: ['shopId', 'email'],
  ownedIndexId: Integer.fromValue(1),
};

export const nodePropertyExistenceConstraintData: ConstraintData = {
  id: Integer.fromValue(2),
  name: 'node_property_existence_constraint_name',
  type: 'NODE_PROPERTY_EXISTENCE',
  entityType: 'NODE',
  labelsOrTypes: ['Customer'],
  properties: ['name'],
  ownedIndexId: null,
};

export const relationshipPropertyExistenceConstraintData: ConstraintData = {
  id: Integer.fromValue(3),
  name: 'relationship_property_existence_constraint_name',
  type: 'RELATIONSHIP_PROPERTY_EXISTENCE',
  entityType: 'RELATIONSHIP',
  labelsOrTypes: ['VISITED'],
  properties: ['date'],
  ownedIndexId: null,
};

export const uniquenessConstraintData: ConstraintData = {
  id: Integer.fromValue(4),
  name: 'uniqueness_constraint_name',
  type: 'UNIQUENESS',
  entityType: 'NODE',
  labelsOrTypes: ['Customer'],
  properties: ['email'],
  ownedIndexId: Integer.fromValue(2),
};
