import { Stem } from '../path/Stem';
import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { GraphMetadata } from '../../metadata/schema/graph/GraphMetadata';
import { MetadataStoreInterface } from '../../metadata/store/MetadataStoreInterface';
import { GraphMaterial } from '../meterial/GraphMaterial';
import { GraphBranchMetadata } from '../../metadata/schema/graph/GraphBranchMetadata';
import { BranchGraphMaterial } from '../meterial/BranchGraphMaterial';
import { BranchFragmentMaterial } from '../meterial/BranchFragmentMaterial';
import { BranchNodeMaterial } from '../meterial/BranchNodeMaterial';
import { Branch } from '../path/Branch';
import { Depth } from '../../domain/graph/branch/Depth';
import { BranchMaterial } from '../meterial/BranchMaterial';
import { GraphFragmentMetadata } from '../../metadata/schema/graph/GraphFragmentMetadata';
import { BranchIndexes } from '../meterial/BranchIndexes';
import { WhereQueries } from './where/WhereQueries';

export class StemBuilder {
  private readonly metadataStore: MetadataStoreInterface;

  constructor(metadataStore: MetadataStoreInterface) {
    this.metadataStore = metadataStore;
  }

  build(
    cstr: AnyClassConstructor,
    whereQueries: WhereQueries,
    depth: Depth
  ): Stem {
    const graphMetadata = this.metadataStore.getGraphMetadata(cstr);
    const graphMaterial = GraphMaterial.new(graphMetadata);

    return new Stem(
      graphMaterial.getPath(),
      whereQueries.ofStem(),
      this.buildBranches(
        graphMetadata,
        graphMaterial,
        whereQueries,
        depth,
        new BranchIndexes([])
      )
    );
  }

  private buildBranches(
    graphMetadata: GraphMetadata | GraphFragmentMetadata,
    stemGraphMaterial: GraphMaterial | BranchMaterial,
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
        stemGraphMaterial,
        whereQueries,
        depth,
        branchIndexes.append(i, branchMetadata.getKey())
      );
    });
  }

  private buildBranch(
    graphBranchMetadata: GraphBranchMetadata,
    stemGraphMaterial: GraphMaterial | BranchMaterial,
    whereQueries: WhereQueries,
    depth: Depth,
    branchIndexes: BranchIndexes
  ): Branch {
    const branchGraphMetadata = this.metadataStore.findGraphMetadata(
      graphBranchMetadata.getBranchCstr()
    );
    const reducedDepth = depth.reduce();
    if (branchGraphMetadata) {
      const branchMaterial = BranchGraphMaterial.new(
        graphBranchMetadata,
        stemGraphMaterial,
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
      const branchFragmentMaterial = BranchFragmentMaterial.new(
        graphBranchMetadata,
        stemGraphMaterial,
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
        BranchNodeMaterial.new(
          graphBranchMetadata,
          nodeEntityMetadata,
          stemGraphMaterial,
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
