import { NodeLiteral } from '../literal/NodeLiteral';
import { Stem } from '../path/Stem';
import { PathLiteral } from '../literal/PathLiteral';
import { PathStepLiteral } from '../literal/PathStepLiteral';
import { Depth } from '../../domain/graph/branch/Depth';
import { WhereLiteral } from '../literal/WhereLiteral';

export class StemQueryContext {
  private readonly stem: Stem;
  private readonly depth: Depth;

  constructor(stem: Stem, depth: Depth) {
    this.stem = stem;
    this.depth = depth;
  }

  getPathLiteral(): PathLiteral {
    return new PathLiteral(
      NodeLiteral.new(this.stem.getRoot()),
      this.stem.getSteps().map((step) => {
        return PathStepLiteral.new(step);
      })
    );
  }

  getWhereLiteral(): WhereLiteral | null {
    const whereQuery = this.stem.getWhereQuery();
    if (whereQuery === null) {
      return null;
    }

    return WhereLiteral.new(whereQuery.getQuery(), this.stem.getPath());
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
