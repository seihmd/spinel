import { BranchMaterialInterface } from './BranchMaterialInterface';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { BranchIndexes } from '../BranchIndexes';
import { StemMaterial } from '../stem/StemMaterial';
import { GraphFragmentMetadata } from '../../../metadata/schema/graph/GraphFragmentMetadata';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { PlainGraph } from '../../element/PlainGraph';
import { PlainEntity } from '../../element/PlainEntity';

export interface BranchMaterialBuilderInterface<
  T extends BranchMaterialInterface
> {
  build(
    graphBranchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchEndMetadata:
      | NodeEntityMetadata
      | GraphFragmentMetadata
      | GraphMetadata,
    branchIndexes: BranchIndexes,
    plain?: PlainGraph | PlainEntity
  ): T;
}
