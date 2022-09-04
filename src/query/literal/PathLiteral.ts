import { NodeLiteral } from './NodeLiteral';
import { PathStepLiteral } from './PathStepLiteral';
import { EntityLiteralOption } from './EntityLiteralOption';
import { Path } from '../path/Path';

export class PathLiteral {
  static new(path: Path): PathLiteral {
    return new PathLiteral(
      NodeLiteral.new(path.getRoot()),
      path.getSteps().map((step) => PathStepLiteral.new(step))
    );
  }

  private nodeLiteral: NodeLiteral;
  private pathStepLiterals: PathStepLiteral[];

  constructor(nodeLiteral: NodeLiteral, pathStepLiterals: PathStepLiteral[]) {
    this.nodeLiteral = nodeLiteral;
    this.pathStepLiterals = pathStepLiterals;
  }

  get(option: Partial<EntityLiteralOption> = {}): string {
    return `${this.nodeLiteral.get(option)}${this.pathStepLiterals
      .map((p) => p.get(option))
      .join('')}`;
  }
}
