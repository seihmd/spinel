import { Depth } from '../../../domain/graph/branch/Depth';
import { LimitClause } from '../../clause/LimitClause';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { OrderByLiteral } from '../../literal/OrderByLiteral';
import { PathLiteral } from '../../literal/PathLiteral';
import { PathStepLiteral } from '../../literal/PathStepLiteral';
import { VariableMap } from '../../literal/util/VariableMap';
import { Stem } from '../../path/Stem';

export class StemQueryContext {
  constructor(private readonly stem: Stem, private readonly depth: Depth) {}

  getPathLiteral(): PathLiteral {
    return new PathLiteral(
      NodeLiteral.new(this.stem.getRoot()),
      this.stem.getSteps().map((step) => {
        return PathStepLiteral.new(step);
      })
    );
  }

  getWhereStatement(): string | null {
    const whereStatement = this.stem.getWhereStatement();
    if (whereStatement === null) {
      return null;
    }

    return whereStatement.assign(VariableMap.withPath(this.stem.getPath()));
  }

  getOrderByLiterals(): OrderByLiteral[] {
    return this.stem
      .getOrderByQueries()
      .getLiterals(VariableMap.withPath(this.stem.getPath()));
  }

  getLimitClause(): LimitClause | null {
    const limit = this.stem.getLimit();
    if (limit === null) {
      return null;
    }

    return new LimitClause(limit);
  }

  getMapEntries(): [string, string][] {
    const entries: [string, string][] = [];
    if (this.stem.getRoot().getGraphKey() !== '') {
      entries.push([
        this.stem.getRoot().getGraphKey(),
        this.stem.getRoot().getVariableName() + '{.*}',
      ]);
    }

    this.stem.getSteps().forEach((step) => {
      if (step.getRelationship().getGraphKey() !== '') {
        entries.push([
          step.getRelationship().getGraphKey(),
          step.getRelationship().getVariableName() + '{.*}',
        ]);
      }
      if (step.getNode().getGraphKey() !== '') {
        entries.push([
          step.getNode().getGraphKey(),
          step.getNode().getVariableName() + '{.*}',
        ]);
      }
    });

    return entries;
  }
}
