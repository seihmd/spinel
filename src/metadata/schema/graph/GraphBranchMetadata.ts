import { GraphBranchPropertyType } from './GraphBranchPropertyType';
import { Depth } from '../../../domain/graph/branch/Depth';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';

export class GraphBranchMetadata {
  private readonly propertyType: GraphBranchPropertyType;
  private readonly keyMapping: [string, string];
  private readonly depth: Depth;

  constructor(
    propertyType: GraphBranchPropertyType,
    keyMapping: [string, string],
    depth: Depth
  ) {
    this.keyMapping = keyMapping;
    this.depth = depth;
    this.propertyType = propertyType;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getType(): AnyClassConstructor {
    return this.propertyType.getType();
  }
}
