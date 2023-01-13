import { Depth } from '../../../domain/graph/branch/Depth';
import { LimitClause } from '../../clause/LimitClause';
import { SkipClause } from '../../clause/SkipClause';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { OrderByLiteral } from '../../literal/OrderByLiteral';
import { PathLiteral } from '../../literal/PathLiteral';
import { PathStepLiteral } from '../../literal/PathStepLiteral';
import { Stem } from '../../path/Stem';
import { VariableSyntaxTranslator } from './statement/VariableSyntaxTranslator';

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

    return whereStatement.translate(
      VariableSyntaxTranslator.withPath(this.stem.getPath())
    );
  }

  getOrderByLiterals(): OrderByLiteral[] {
    return this.stem
      .getOrderByStatements()
      .map(
        (s) =>
          new OrderByLiteral(
            s.translate(VariableSyntaxTranslator.withPath(this.stem.getPath())),
            s.getSort()
          )
      );
  }

  getLimitClause(): LimitClause | null {
    const limit = this.stem.getLimit();
    if (limit === null) {
      return null;
    }

    return new LimitClause(limit);
  }

  getSkipClause(): SkipClause | null {
    const skip = this.stem.getSkip();
    if (skip === null) {
      return null;
    }

    return new SkipClause(skip);
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
