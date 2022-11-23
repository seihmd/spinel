import {
  AnyClassConstructor,
  ClassConstructor,
} from '../../../domain/type/ClassConstructor';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { SaveQuery } from './SaveQuery';
import { Path } from '../../path/Path';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { ElementContext } from '../../element/ElementContext';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { StemMaterialBuilder } from '../../meterial/stem/StemMaterialBuilder';
import { getMetadataStore } from '../../../metadata/store/MetadataStore';
import { InstanceElementBuilder } from '../../meterial/stem/InstanceElementBuilder';
import { Parameter } from '../../parameter/Parameter';
import { ParameterBag } from '../../parameter/ParameterBag';
import { BranchMaterialBuilder } from '../../meterial/branch/BranchMaterialBuilder';
import { NodeBranchMaterialBuilder } from '../../meterial/branch/NodeBranchMaterialBuilder';
import { InstanceElementBuilder as BranchInstanceElementBuilder } from '../../meterial/branch/InstanceElementBuilder';
import { GraphBranchMaterialBuilder } from '../../meterial/branch/GraphBranchMaterialBuilder';
import { FragmentBranchMaterialBuilder } from '../../meterial/branch/FragmentBranchMaterialBuilder';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { StemMaterial } from '../../meterial/stem/StemMaterial';
import { BranchMaterialInterface } from '../../meterial/branch/BranchMaterialInterface';
import { GraphFragmentMetadata } from '../../../metadata/schema/graph/GraphFragmentMetadata';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { Branch } from '../../path/Branch';
import { PlainGraph } from '../../element/PlainGraph';
import { PlainEntity } from '../../element/PlainEntity';
import { BranchEndTerm } from '../../../domain/graph/pattern/term/BranchEndTerm';

export class SaveQueryBuilder {
  static new(): SaveQueryBuilder {
    return new SaveQueryBuilder(
      getMetadataStore(),
      new StemMaterialBuilder(new InstanceElementBuilder()),
      new BranchMaterialBuilder(
        new NodeBranchMaterialBuilder(new BranchInstanceElementBuilder()),
        new GraphBranchMaterialBuilder(new BranchInstanceElementBuilder()),
        new FragmentBranchMaterialBuilder(new BranchInstanceElementBuilder())
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
    instance: InstanceType<ClassConstructor<object>>
  ): [SaveQuery, ParameterBag] {
    const parameterBag = new ParameterBag();

    const cstr = instance.constructor as AnyClassConstructor;
    const graphMetadata = this.metadataStore.findGraphMetadata(cstr);
    if (graphMetadata) {
      const plainGraph = PlainGraph.withInstance(instance);
      const stemMaterial = this.stemMaterialBuilder.build(
        graphMetadata,
        plainGraph
      );
      stemMaterial.getInstanceElements().forEach((instanceElement) => {
        parameterBag.add(
          Parameter.new(
            instanceElement.getVariableName(),
            instanceElement.getProperties().parameterize()
          )
        );
      });

      const branches = this.buildBranches(
        plainGraph,
        graphMetadata,
        stemMaterial,
        new BranchIndexes([])
      );

      branches.forEach((branch) => {
        branch.getPaths().forEach((path) => {
          path.getInstanceElements(false).forEach((instanceElement) => {
            parameterBag.add(
              Parameter.new(
                instanceElement.getVariableName(),
                instanceElement.getProperties().parameterize()
              )
            );
          });
        });
      });

      return [
        new SaveQuery(
          stemMaterial.getPath(),
          branches
            .map((branch: Branch) => {
              return branch.getPaths();
            })
            .flat()
        ),
        parameterBag,
      ];
    }

    const nodeMetadata = this.metadataStore.findNodeEntityMetadata(cstr);
    if (nodeMetadata) {
      const nodeInstanceElement = new NodeInstanceElement(
        instance,
        nodeMetadata,
        new ElementContext(new BranchIndexes([]), 0, false),
        new BranchEndTerm('*')
      );
      parameterBag.add(
        Parameter.new(
          nodeInstanceElement.getVariableName(),
          nodeInstanceElement.getProperties().parameterize()
        )
      );
      return [
        new SaveQuery(new Path(nodeInstanceElement, []), []),
        parameterBag,
      ];
    }

    const relationshipMetadata =
      this.metadataStore.findRelationshipEntityMetadata(cstr);
    if (relationshipMetadata) {
      throw new Error('Relationship instance cannot be saved alone');
    }

    throw new Error(`Metadata of class "${cstr.name}" is not found`);
  }

  private buildBranches(
    plainGraph: PlainGraph,
    graphMetadata: GraphMetadata | GraphFragmentMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchIndexes: BranchIndexes
  ): Branch[] {
    const branches: Branch[] = [];
    graphMetadata.getBranchesMetadata().forEach((branchMetadata, i) => {
      branches.push(
        ...this.buildBranch(
          plainGraph,
          branchMetadata,
          stemMaterial,
          branchIndexes,
          i
        )
      );
    });

    return branches;
  }

  private buildBranch(
    plainGraph: PlainGraph,
    branchMetadata: GraphBranchMetadata,
    stemMaterial: StemMaterial | BranchMaterialInterface,
    branchIndexes: BranchIndexes,
    branchIndexNumber: number
  ): Branch[] {
    const branchGraphMetadata = this.metadataStore.findGraphMetadata(
      branchMetadata.getBranchCstr()
    );

    if (branchGraphMetadata) {
      const plainBranches = plainGraph.getBranches(branchMetadata.getKey());
      return plainBranches.map((plainBranch, i: number) => {
        const branchMaterial =
          this.branchMaterialBuilder.buildGraphBranchMaterial(
            branchMetadata,
            stemMaterial,
            branchGraphMetadata,
            branchIndexes.append(branchIndexNumber, branchMetadata.getKey(), i),
            plainBranch
          );
        return new Branch(
          branchMaterial,
          null,
          this.buildBranches(
            plainBranch,
            branchGraphMetadata,
            branchMaterial,
            branchIndexes.append(branchIndexNumber, branchMetadata.getKey(), i)
          )
        );
      });
    }

    const graphFragmentMetadata = this.metadataStore.findGraphFragmentMetadata(
      branchMetadata.getBranchCstr()
    );
    if (graphFragmentMetadata) {
      const plainBranches = plainGraph.getBranches(branchMetadata.getKey());
      return plainBranches.map((plainBranch: PlainGraph, i: number) => {
        const branchFragmentMaterial =
          this.branchMaterialBuilder.buildFragmentBranchMaterial(
            branchMetadata,
            stemMaterial,
            graphFragmentMetadata,
            branchIndexes.append(branchIndexNumber, branchMetadata.getKey(), i),
            plainBranch
          );

        return new Branch(
          branchFragmentMaterial,
          null,
          this.buildBranches(
            plainBranch,
            graphFragmentMetadata,
            branchFragmentMaterial,
            branchIndexes.append(branchIndexNumber, branchMetadata.getKey(), i)
          )
        );
      });
    }

    const nodeEntityMetadata = this.metadataStore.findNodeEntityMetadata(
      branchMetadata.getBranchCstr()
    );

    if (nodeEntityMetadata) {
      const plainEntities = plainGraph.getEntities(branchMetadata.getKey());
      return plainEntities.map((plainEntity: PlainEntity, i: number) => {
        return new Branch(
          this.branchMaterialBuilder.buildNodeBranchMaterial(
            branchMetadata,
            stemMaterial,
            nodeEntityMetadata,
            branchIndexes.append(branchIndexNumber, branchMetadata.getKey(), i),
            plainEntity
          ),
          null,
          []
        );
      });
    }

    throw new Error(
      `Branch type "${
        branchMetadata.getBranchCstr().name
      }" is not registered as Graph or Node`
    );
  }
}
