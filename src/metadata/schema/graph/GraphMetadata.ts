import { PatternFormula } from '../../../domain/graph/pattern/formula/PatternFormula';
import { GraphProperties } from './GraphProperties';
import { AnyClassConstructor } from '../../../domain/type/ClassConstructor';

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
}
