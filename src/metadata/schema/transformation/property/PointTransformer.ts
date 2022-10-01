import { TransformerInterface } from './TransformerInterface';
import { Point } from 'neo4j-driver';
import { isRecord } from '../../../../util/isRecord';

export class PointTransformer implements TransformerInterface<Point<number>> {
  unparameterize(value: Point<number>): Point<number> {
    return value;
  }

  parameterize(value: any): Point<number> {
    if (isPlainPoint(value)) {
      return new Point<number>(value.srid, value.x, value.y, value.z);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}

function isPlainPoint(
  value: any
): value is { srid: number; x: number; y: number; z: number | undefined } {
  if (!isRecord(value)) {
    return false;
  }

  return 'srid' in value && 'x' in value && 'y' in value && 'z' in value;
}
