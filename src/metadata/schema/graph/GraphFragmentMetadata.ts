import { FragmentPatternFormula } from '../../../domain/graph/pattern/formula/FragmentPatternFormula';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { BranchEndMetadata } from './BranchEndMetadata';
import { GraphBranchMetadata } from './GraphBranchMetadata';
import { GraphNodeMetadata } from './GraphNodeMetadata';
import { GraphProperties } from './GraphProperties';
import { GraphRelationshipMetadata } from './GraphRelationshipMetadata';

export class GraphFragmentMetadata implements BranchEndMetadata {
  private readonly cstr: AnyClassConstructor;
  private readonly formula: FragmentPatternFormula;
  private readonly properties: GraphProperties;

  constructor(
    cstr: AnyClassConstructor,
    formula: FragmentPatternFormula,
    properties: GraphProperties
  ) {
    this.cstr = cstr;
    this.formula = formula;
    this.properties = properties;
  }

  getCstr(): AnyClassConstructor {
    return this.cstr;
  }

  getBranchesMetadata(): GraphBranchMetadata[] {
    return this.properties.getBranchesMetadata();
  }

  getGraphNodeMetadata(key: string): GraphNodeMetadata {
    return this.properties.getNodeMetadata(key);
  }

  getGraphRelationshipMetadata(key: string): GraphRelationshipMetadata {
    return this.properties.getRelationshipMetadata(key);
  }

  findGraphNodeMetadata(key: string): GraphNodeMetadata | null {
    return this.properties.findNodeMetadata(key);
  }

  findGraphRelationshipMetadata(key: string): GraphRelationshipMetadata | null {
    return this.properties.findRelationshipMetadata(key);
  }

  findBranchMetadata(key: string): GraphBranchMetadata | null {
    return this.properties.findBranchMetadata(key);
  }

  getFormula(): FragmentPatternFormula {
    return this.formula;
  }
}
