import { NodeLiteral } from './NodeLiteral';
import { PathStepLiteral } from './PathStepLiteral';
import { Path } from '../path/Path';
import { GraphParameter } from '../parameter/GraphParameter';
import { ParameterLiteral } from './ParameterLiteral';

export class PathLiteral {
  static new(path: Path, graphParameter: GraphParameter): PathLiteral {
    return new PathLiteral(
      NodeLiteral.new(
        path.getRoot(),
        ParameterLiteral.new(path.getRoot(), graphParameter)
      ),
      path.getSteps().map((step) => PathStepLiteral.new(step, graphParameter))
    );
  }

  private nodeLiteral: NodeLiteral;
  private pathStepLiterals: PathStepLiteral[];

  constructor(nodeLiteral: NodeLiteral, pathStepLiterals: PathStepLiteral[]) {
    this.nodeLiteral = nodeLiteral;
    this.pathStepLiterals = pathStepLiterals;
  }

  get(): string {
    return `${this.nodeLiteral.get()}${this.pathStepLiterals
      .map((p) => p.get())
      .join('')}`;
  }
}
