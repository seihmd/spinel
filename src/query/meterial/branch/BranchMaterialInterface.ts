import { Path } from '../../path/Path';
import { PathStep } from '../../path/PathStep';
import { Branch } from '../../path/Branch';
import { BranchIndexes } from '../BranchIndexes';
import { AnyNodeElement } from '../../element/Element';

export interface BranchMaterialInterface {
  getPath(): Path;

  getRootKey(): string;

  getGraphKey(): string;

  getSteps(): PathStep[];

  getRootVariableName(): string;

  getFilter(branches: Branch[]): string;

  getNodeElement(key: string, branchIndexes: BranchIndexes): AnyNodeElement;
}
