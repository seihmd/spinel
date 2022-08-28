import { Path } from '../path/Path';
import { PathStep } from '../path/PathStep';
import { AnyNodeElement } from '../element/Element';
import { Branch } from '../path/Branch';
import { BranchIndexes } from './BranchIndexes';

export interface BranchMaterial {
  getPath(): Path;

  getRootKey(): string;

  getGraphKey(): string;

  getSteps(): PathStep[];

  getRootVariableName(): string;

  getFilter(branches: Branch[]): string;

  getNodeElement(key: string, branchIndexes: BranchIndexes): AnyNodeElement;
}
