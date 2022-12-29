import { BranchIndexes } from '../meterial/BranchIndexes';
import { ElementContext } from './ElementContext';

export interface EntityElementInterface {
  getVariableName(): string;

  getGraphKey(): string;

  getGraphParameterKey(): string | null;

  getWhereVariableName(isTerminal: boolean): string | null;

  withContext(newContext: ElementContext): EntityElementInterface;

  getIndex(): number;

  equalsBranchIndexes(branchIndexes: BranchIndexes): boolean;
}
