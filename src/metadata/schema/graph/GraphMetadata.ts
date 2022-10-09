import { GraphPatternFormula } from '../../../domain/graph/pattern/formula/GraphPatternFormula';
import { GraphProperties } from './GraphProperties';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { GraphNodeMetadata } from './GraphNodeMetadata';
import { GraphRelationshipMetadata } from './GraphRelationshipMetadata';
import { GraphBranchMetadata } from './GraphBranchMetadata';
import { BranchEndMetadata } from './BranchEndMetadata';

export class GraphMetadata implements BranchEndMetadata {
  private readonly cstr: AnyClassConstructor;
  private readonly formula: GraphPatternFormula;
  private readonly properties: GraphProperties;

  constructor(
    cstr: AnyClassConstructor,
    formula: GraphPatternFormula,
    properties: GraphProperties
  ) {
    this.cstr = cstr;
    this.formula = formula;
    this.properties = properties;
  }

  getCstr(): AnyClassConstructor {
    return this.cstr;
  }

  getGraphNodeMetadata(key: string): GraphNodeMetadata {
    return this.properties.getNodeMetadata(key);
  }

  getGraphRelationshipMetadata(key: string): GraphRelationshipMetadata {
    return this.properties.getRelationshipMetadata(key);
  }

  getBranchesMetadata(): GraphBranchMetadata[] {
    return this.properties.getBranchesMetadata();
  }

  findBranchMetadata(key: string): GraphBranchMetadata | null {
    return this.properties.findBranchMetadata(key);
  }

  findGraphNodeMetadata(key: string): GraphNodeMetadata | null {
    return this.properties.findNodeMetadata(key);
  }

  findGraphRelationshipMetadata(key: string): GraphRelationshipMetadata | null {
    return this.properties.findRelationshipMetadata(key);
  }

  getFormula(): GraphPatternFormula {
    return this.formula;
  }

  getRootKey(): string | null {
    return this.formula.getRootTerm().getKey();
  }

  getTerminalKey(): string | null {
    return this.formula.getTerminalTerm().getKey();
  }
}
