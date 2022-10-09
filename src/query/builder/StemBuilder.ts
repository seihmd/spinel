import { Stem } from '../path/Stem';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { GraphMetadata } from '../../metadata/schema/graph/GraphMetadata';
import { MetadataStoreInterface } from '../../metadata/store/MetadataStoreInterface';
import { GraphBranchMetadata } from '../../metadata/schema/graph/GraphBranchMetadata';
import { Branch } from '../path/Branch';
import { Depth } from '../../domain/graph/branch/Depth';
import { GraphFragmentMetadata } from '../../metadata/schema/graph/GraphFragmentMetadata';
import { BranchIndexes } from '../meterial/BranchIndexes';
import { WhereQueries } from './where/WhereQueries';
import { StemMaterialBuilder } from '../meterial/stem/StemMaterialBuilder';
import { StemMaterial } from '../meterial/stem/StemMaterial';
import { getMetadataStore } from '../../metadata/store/MetadataStore';
import { TermElementBuilder } from '../meterial/stem/TermElementBuilder';
import { TermElementBuilder as BranchTermElementBuilder } from '../meterial/branch/TermElementBuilder';
import { BranchMaterialInterface } from '../meterial/branch/BranchMaterialInterface';
import { BranchMaterialBuilder } from '../meterial/branch/BranchMaterialBuilder';
import { GraphBranchMaterialBuilder } from '../meterial/branch/GraphBranchMaterialBuilder';
import { NodeBranchMaterialBuilder } from '../meterial/branch/NodeBranchMaterialBuilder';
import { FragmentBranchMaterialBuilder } from '../meterial/branch/FragmentBranchMaterialBuilder';

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
    cstr: AnyClassConstructor,
    whereQueries: WhereQueries,
    depth: Depth
  ): Stem {
    const graphMetadata = this.metadataStore.getGraphMetadata(cstr);
    const stemMaterial = this.stemMaterialBuilder.build(graphMetadata);

    return new Stem(
      stemMaterial.getPath(),
      whereQueries.ofStem(),
      this.buildBranches(
        graphMetadata,
        stemMaterial,
        whereQueries,
        depth,
        new BranchIndexes([])
      )
    );
  }

  private buildBranches(
    graphMetadata: GraphMetadata | GraphFragmentMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    whereQueries: WhereQueries,
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
        whereQueries,
        depth,
        branchIndexes.append(i, branchMetadata.getKey())
      );
    });
  }

  private buildBranch(
    graphBranchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    whereQueries: WhereQueries,
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
        whereQueries.of(branchIndexes),
        this.buildBranches(
          branchGraphMetadata,
          branchMaterial,
          whereQueries,
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
        whereQueries.of(branchIndexes),
        this.buildBranches(
          graphFragmentMetadata,
          branchFragmentMaterial,
          whereQueries,
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
        whereQueries.of(branchIndexes),
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