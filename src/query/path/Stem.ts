import { PositiveInt } from '../../domain/type/PositiveInt';
import { OrderByQueries } from '../builder/orderBy/OrderByQueries';
import { WhereStatement } from '../clause/where/WhereStatement';
import { AnyNodeElement, EntityElement } from '../element/Element';
import { Branch } from './Branch';
import { Path } from './Path';
import { PathStep } from './PathStep';

export class Stem {
  constructor(
    private readonly path: Path,
    private readonly whereStatement: WhereStatement | null,
    private readonly orderByQueries: OrderByQueries,
    private readonly limit: PositiveInt | null,
    private readonly branches: Branch[]
  ) {}

  getRoot(): AnyNodeElement {
    return this.path.getRoot();
  }

  getSteps(): PathStep[] {
    return this.path.getSteps();
  }

  getPath(): Path {
    return this.path;
  }

  getBranches(): Branch[] {
    return this.branches;
  }

  getEntityElements(): EntityElement[] {
    return this.path.getEntityElements();
  }

  getWhereStatement(): WhereStatement | null {
    return this.whereStatement;
  }

  getOrderByQueries(): OrderByQueries {
    return this.orderByQueries;
  }

  getLimit(): PositiveInt | null {
    return this.limit;
  }
}
