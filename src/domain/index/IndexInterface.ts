import { IndexType } from './IndexType';
import { NodeLabel } from '../node/NodeLabel';
import { RelationshipType } from '../relationship/RelationshipType';

export interface IndexInterface {
  getLabelOrType(): NodeLabel | RelationshipType;

  getIndexType(): IndexType;

  getProperties(): string[];

  getOptions(): string | null;

  getName(): string;
}
