import { Depth } from '../../../domain/graph/branch/Depth';
import { PositiveInt } from '../../../domain/type/PositiveInt';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { GraphFragmentMetadata } from '../../../metadata/schema/graph/GraphFragmentMetadata';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { BranchMaterialBuilder } from '../../meterial/branch/BranchMaterialBuilder';
import { BranchMaterialInterface } from '../../meterial/branch/BranchMaterialInterface';
import { FragmentBranchMaterialBuilder } from '../../meterial/branch/FragmentBranchMaterialBuilder';
import { GraphBranchMaterialBuilder } from '../../meterial/branch/GraphBranchMaterialBuilder';
import { NodeBranchMaterialBuilder } from '../../meterial/branch/NodeBranchMaterialBuilder';
import { TermElementBuilder as BranchTermElementBuilder } from '../../meterial/branch/TermElementBuilder';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { StemMaterial } from '../../meterial/stem/StemMaterial';
import { StemMaterialBuilder } from '../../meterial/stem/StemMaterialBuilder';
import { TermElementBuilder } from '../../meterial/stem/TermElementBuilder';
import { Branch } from '../../path/Branch';
import { Stem } from '../../path/Stem';
import { OrderByStatement } from './orderBy/OrderByStatement';
import { BranchFilters } from './where/BranchFilters';
import { WhereStatement } from './where/WhereStatement';

export class StemBuilder {
  static new(): StemBuilder {
    return new StemBuilder(
      getMetadataStore(),
      new StemMaterialBuilder(new TermElementBuilder()),
      new BranchMaterialBuilder(
        new NodeBranchMaterialBuilder(new BranchTermElementBuilder()),
        new GraphBranchMaterialBuilder(new BranchTermElementBuilder()),
        new FragmentBranchMaterialBuilder(new BranchTermElementBuilder())
      )
    );
  }

  private readonly metadataStore: MetadataStoreInterface;
  private readonly stemMaterialBuilder: StemMaterialBuilder;
  private readonly branchMaterialBuilder: BranchMaterialBuilder;

  constructor(
    metadataStore: MetadataStoreInterface,
    stemMaterialBuilder: StemMaterialBuilder,
    branchMaterialBuilder: BranchMaterialBuilder
  ) {
    this.metadataStore = metadataStore;
    this.stemMaterialBuilder = stemMaterialBuilder;
    this.branchMaterialBuilder = branchMaterialBuilder;
  }

  build(
    graphMetadata: GraphMetadata,
    whereStatement: WhereStatement | null,
    branchFilters: BranchFilters,
    orderByStatements: OrderByStatement[],
    limit: PositiveInt | null,
    depth: Depth
  ): Stem {
    const stemMaterial = this.stemMaterialBuilder.build(graphMetadata);

    return new Stem(
      stemMaterial.getPath(),
      whereStatement,
      orderByStatements,
      limit,
      this.buildBranches(
        graphMetadata,
        stemMaterial,
        branchFilters,
        depth,
        new BranchIndexes([])
      )
    );
  }

  private buildBranches(
    graphMetadata: GraphMetadata | GraphFragmentMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchFilters: BranchFilters,
    depth: Depth,
    branchIndexes: BranchIndexes
  ): Branch[] {
    if (!depth.canReduce()) {
      return [];
    }
    return graphMetadata.getBranchesMetadata().map((branchMetadata, i) => {
      return this.buildBranch(
        branchMetadata,
        stemMaterial,
        branchFilters,
        depth,
        branchIndexes.append(i, branchMetadata.getKey())
      );
    });
  }

  private buildBranch(
    graphBranchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchFilters: BranchFilters,
    depth: Depth,
    branchIndexes: BranchIndexes
  ): Branch {
    const branchGraphMetadata = this.metadataStore.findGraphMetadata(
      graphBranchMetadata.getBranchCstr()
    );
    const reducedDepth = depth.reduce();
    if (branchGraphMetadata) {
      const branchMaterial =
        this.branchMaterialBuilder.buildGraphBranchMaterial(
          graphBranchMetadata,
          stemMaterial,
          branchGraphMetadata,
          branchIndexes
        );

      return new Branch(
        branchMaterial,
        branchFilters.of(branchIndexes),
        this.buildBranches(
          branchGraphMetadata,
          branchMaterial,
          branchFilters,
          reducedDepth,
          branchIndexes
        )
      );
    }

    const graphFragmentMetadata = this.metadataStore.findGraphFragmentMetadata(
      graphBranchMetadata.getBranchCstr()
    );
    if (graphFragmentMetadata) {
      const branchFragmentMaterial =
        this.branchMaterialBuilder.buildFragmentBranchMaterial(
          graphBranchMetadata,
          stemMaterial,
          graphFragmentMetadata,
          branchIndexes
        );

      return new Branch(
        branchFragmentMaterial,
        branchFilters.of(branchIndexes),
        this.buildBranches(
          graphFragmentMetadata,
          branchFragmentMaterial,
          branchFilters,
          reducedDepth,
          branchIndexes
        )
      );
    }

    const nodeEntityMetadata = this.metadataStore.findNodeEntityMetadata(
      graphBranchMetadata.getBranchCstr()
    );
    if (nodeEntityMetadata) {
      return new Branch(
        this.branchMaterialBuilder.buildNodeBranchMaterial(
          graphBranchMetadata,
          stemMaterial,
          nodeEntityMetadata,
          branchIndexes
        ),
        branchFilters.of(branchIndexes),
        []
      );
    }

    throw new Error(
      `Branch type "${
        graphBranchMetadata.getBranchCstr().name
      }" is not registered as Graph or Node`
    );
  }
}
