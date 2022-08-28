import { GraphBranchPropertyType } from './GraphBranchPropertyType';
import { Depth } from '../../../domain/graph/branch/Depth';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import {
  AssociationPatternFormula,
  IntermediateTerm,
} from '../../../domain/graph/pattern/formula/AssociationPatternFormula';
import { getMetadataStore } from '../../store/MetadataStore';
import { NodeEntityMetadata } from '../entity/NodeEntityMetadata';
import { GraphMetadata } from './GraphMetadata';
import { GraphFragmentMetadata } from './GraphFragmentMetadata';
import { NodeTerm, Term } from '../../../domain/graph/pattern/term/Term';

export class GraphBranchMetadata {
  private readonly propertyType: GraphBranchPropertyType;
  private readonly associationPatternFormula: AssociationPatternFormula;
  private readonly depth: Depth;

  constructor(
    propertyType: GraphBranchPropertyType,
    associationPatternFormula: AssociationPatternFormula,
    depth: Depth
  ) {
    this.depth = depth;
    this.propertyType = propertyType;
    this.associationPatternFormula = associationPatternFormula;
  }

  getKey(): string {
    return this.propertyType.getKey();
  }

  getRootKey(): string {
    const key = this.associationPatternFormula.getRootTerm().getKey();
    if (key === null) {
      throw new Error('Branch root key must not be null');
    }
    return key;
  }

  getRootTerm(): NodeTerm {
    return this.associationPatternFormula.getRootTerm();
  }

  getTerminalTerm(): Term {
    return this.associationPatternFormula.getTerminalTerm();
  }

  getBranchCstr(): AnyClassConstructor {
    return this.propertyType.getType();
  }

  getFormula(): AssociationPatternFormula {
    return this.associationPatternFormula;
  }

  getIntermediateTerms(): IntermediateTerm[] {
    return this.associationPatternFormula.getIntermediate();
  }

  getBranchEndMetadata():
    | NodeEntityMetadata
    | GraphMetadata
    | GraphFragmentMetadata {
    const metadataStore = getMetadataStore();
    const nodeEntityMetadata = metadataStore.findNodeEntityMetadata(
      this.getBranchCstr()
    );
    if (nodeEntityMetadata) {
      return nodeEntityMetadata;
    }

    const graphMetadata = metadataStore.findGraphMetadata(this.getBranchCstr());
    if (graphMetadata) {
      return graphMetadata;
    }

    const fragmentMetadata = metadataStore.findGraphFragmentMetadata(
      this.getBranchCstr()
    );
    if (fragmentMetadata) {
      return fragmentMetadata;
    }

    throw new Error(`${this.getBranchCstr().name} is not registered`);
  }
}
