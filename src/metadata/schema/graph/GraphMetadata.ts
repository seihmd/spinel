import { PatternFormula } from '../../../domain/graph/pattern/formula/PatternFormula';
import { GraphProperties } from './GraphProperties';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';
import { GraphNodeMetadata } from './GraphNodeMetadata';
import { GraphRelationshipMetadata } from './GraphRelationshipMetadata';

export class GraphMetadata {
  private readonly cstr: AnyClassConstructor;
  private readonly formula: PatternFormula;
  private readonly properties: GraphProperties;

  constructor(
    cstr: AnyClassConstructor,
    formula: PatternFormula,
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
}
