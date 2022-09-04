import { NodeBranchMaterialBuilder } from './NodeBranchMaterialBuilder';
import { GraphBranchMaterialBuilder } from './GraphBranchMaterialBuilder';
import { FragmentBranchMaterialBuilder } from './FragmentBranchMaterialBuilder';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { StemMaterial } from '../stem/StemMaterial';
import { BranchMaterialInterface } from './BranchMaterialInterface';
import { NodeEntityMetadata } from '../../../metadata/schema/entity/NodeEntityMetadata';
import { BranchIndexes } from '../BranchIndexes';
import { NodeBranchMaterial } from './NodeBranchMaterial';
import { GraphBranchMaterial } from './GraphBranchMaterial';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { FragmentBranchMaterial } from './FragmentBranchMaterial';
import { GraphFragmentMetadata } from '../../../metadata/schema/graph/GraphFragmentMetadata';
import { PlainEntity } from '../../element/PlainEntity';
import { PlainGraph } from '../../element/PlainGraph';

export class BranchMaterialBuilder {
  private readonly nodeBranchMaterialBuilder: NodeBranchMaterialBuilder;
  private readonly graphBranchMaterialBuilder: GraphBranchMaterialBuilder;
  private readonly fragmentBranchMaterialBuilder: FragmentBranchMaterialBuilder;

  constructor(
    nodeBranchMaterialBuilder: NodeBranchMaterialBuilder,
    graphBranchMaterialBuilder: GraphBranchMaterialBuilder,
    fragmentBranchMaterialBuilder: FragmentBranchMaterialBuilder
  ) {
    this.nodeBranchMaterialBuilder = nodeBranchMaterialBuilder;
    this.graphBranchMaterialBuilder = graphBranchMaterialBuilder;
    this.fragmentBranchMaterialBuilder = fragmentBranchMaterialBuilder;
  }

  buildNodeBranchMaterial(
    graphBranchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchEndMetadata: NodeEntityMetadata,
    branchIndexes: BranchIndexes,
    plainEntity?: PlainEntity
  ): NodeBranchMaterial {
    return this.nodeBranchMaterialBuilder.build(
      graphBranchMetadata,
      stemMaterial,
      branchEndMetadata,
      branchIndexes,
      plainEntity
    );
  }

  buildGraphBranchMaterial(
    graphBranchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchEndMetadata: GraphMetadata,
    branchIndexes: BranchIndexes,
    plainGraph?: PlainGraph
  ): GraphBranchMaterial {
    return this.graphBranchMaterialBuilder.build(
      graphBranchMetadata,
      stemMaterial,
      branchEndMetadata,
      branchIndexes,
      plainGraph
    );
  }

  buildFragmentBranchMaterial(
    graphBranchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchEndMetadata: GraphFragmentMetadata,
    branchIndexes: BranchIndexes,
    plainGraph?: PlainGraph
  ): FragmentBranchMaterial {
    return this.fragmentBranchMaterialBuilder.build(
      graphBranchMetadata,
      stemMaterial,
      branchEndMetadata,
      branchIndexes,
      plainGraph
    );
  }
}
