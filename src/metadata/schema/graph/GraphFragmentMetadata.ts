import { GraphProperties } from './GraphProperties';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { GraphNodeMetadata } from './GraphNodeMetadata';
import { GraphRelationshipMetadata } from './GraphRelationshipMetadata';
import { FragmentPatternFormula } from '../../../domain/graph/pattern/formula/FragmentPatternFormula';
import { GraphBranchMetadata } from './GraphBranchMetadata';
import { BranchEndMetadata } from './BranchEndMetadata';

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

  getFormula(): FragmentPatternFormula {
    return this.formula;
  }
}
