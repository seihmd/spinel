import camelCase from 'lodash.camelcase';
import { NodeKeyTerm } from '../../../domain/graph/pattern/term/NodeKeyTerm';
import {
  AnyClassConstructor,
  ClassConstructor,
} from '../../../domain/type/ClassConstructor';
import { GraphBranchMetadata } from '../../../metadata/schema/graph/GraphBranchMetadata';
import { GraphFragmentMetadata } from '../../../metadata/schema/graph/GraphFragmentMetadata';
import { GraphMetadata } from '../../../metadata/schema/graph/GraphMetadata';
import { MetadataStoreInterface } from '../../../metadata/store/MetadataStoreInterface';
import { SessionProviderInterface } from '../../driver/SessionProviderInterface';
import { ElementContext } from '../../element/ElementContext';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { PlainEntity } from '../../element/PlainEntity';
import { PlainGraph } from '../../element/PlainGraph';
import { BranchMaterialBuilder } from '../../meterial/branch/BranchMaterialBuilder';
import { BranchMaterialInterface } from '../../meterial/branch/BranchMaterialInterface';
import { FragmentBranchMaterialBuilder } from '../../meterial/branch/FragmentBranchMaterialBuilder';
import { GraphBranchMaterialBuilder } from '../../meterial/branch/GraphBranchMaterialBuilder';
import { InstanceElementBuilder as BranchInstanceElementBuilder } from '../../meterial/branch/InstanceElementBuilder';
import { NodeBranchMaterialBuilder } from '../../meterial/branch/NodeBranchMaterialBuilder';
import { BranchIndexes } from '../../meterial/BranchIndexes';
import { InstanceElementBuilder } from '../../meterial/stem/InstanceElementBuilder';
import { StemMaterial } from '../../meterial/stem/StemMaterial';
import { StemMaterialBuilder } from '../../meterial/stem/StemMaterialBuilder';
import { Parameter } from '../../parameter/Parameter';
import { ParameterBag } from '../../parameter/ParameterBag';
import { Branch } from '../../path/Branch';
import { Path } from '../../path/Path';
import { SaveQuery } from './SaveQuery';
import { SaveStatement } from './SaveStatement';

export class SaveQueryBuilder {
  private readonly sessionProvider: SessionProviderInterface;
  private readonly metadataStore: MetadataStoreInterface;
  private readonly instance: InstanceType<ClassConstructor<object>>;

  constructor(
    sessionProvider: SessionProviderInterface,
    metadataStore: MetadataStoreInterface,
    instance: InstanceType<ClassConstructor<object>>
  ) {
    this.sessionProvider = sessionProvider;
    this.metadataStore = metadataStore;
    this.instance = instance;
  }

  buildQuery(): SaveQuery {
    const stemMaterialBuilder = new StemMaterialBuilder(
      new InstanceElementBuilder()
    );
    const parameterBag = new ParameterBag();

    const cstr = this.instance.constructor as AnyClassConstructor;
    const graphMetadata = this.metadataStore.findGraphMetadata(cstr);
    if (graphMetadata) {
      const plainGraph = PlainGraph.withInstance(this.instance);
      const stemMaterial = stemMaterialBuilder.build(graphMetadata, plainGraph);
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

      return new SaveQuery(
        this.sessionProvider,
        new SaveStatement(
          stemMaterial.getPath(),
          branches
            .map((branch: Branch) => {
              return branch.getPaths();
            })
            .flat()
        ),
        parameterBag
      );
    }

    const nodeMetadata = this.metadataStore.findNodeEntityMetadata(cstr);
    if (nodeMetadata) {
      const nodeInstanceElement = new NodeInstanceElement(
        this.instance,
        nodeMetadata,
        new ElementContext(new BranchIndexes([]), 0, false),
        new NodeKeyTerm(camelCase(nodeMetadata.getCstr().name))
      );
      parameterBag.add(
        Parameter.new(
          nodeInstanceElement.getVariableName(),
          nodeInstanceElement.getProperties().parameterize()
        )
      );
      return new SaveQuery(
        this.sessionProvider,
        new SaveStatement(new Path(nodeInstanceElement, []), []),
        parameterBag
      );
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
    const branchMaterialBuilder = new BranchMaterialBuilder(
      new NodeBranchMaterialBuilder(new BranchInstanceElementBuilder()),
      new GraphBranchMaterialBuilder(new BranchInstanceElementBuilder()),
      new FragmentBranchMaterialBuilder(new BranchInstanceElementBuilder())
    );

    const branchGraphMetadata = this.metadataStore.findGraphMetadata(
      branchMetadata.getBranchCstr()
    );

    if (branchGraphMetadata) {
      const plainBranches = plainGraph.getBranches(branchMetadata.getKey());
      return plainBranches.map((plainBranch, i: number) => {
        const branchMaterial = branchMaterialBuilder.buildGraphBranchMaterial(
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
          branchMaterialBuilder.buildFragmentBranchMaterial(
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
          branchMaterialBuilder.buildNodeBranchMaterial(
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
