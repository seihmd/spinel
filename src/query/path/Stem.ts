import { Branch } from './Branch';
import { PathStep } from './PathStep';
import { AnyNodeElement, EntityElement } from '../element/Element';
import { Path } from './Path';
import { WhereQuery } from '../builder/where/WhereQuery';
import { OrderByQueries } from '../builder/orderBy/OrderByQueries';

export class Stem {
  private readonly path: Path;
  private readonly whereQuery: WhereQuery | null;
  private readonly branches: Branch[];
  private readonly orderByQueries: OrderByQueries;

  constructor(
    path: Path,
    whereQuery: WhereQuery | null,
    orderByQueries: OrderByQueries,
    branches: Branch[]
  ) {
    this.orderByQueries = orderByQueries;
    this.whereQuery = whereQuery;
    this.path = path;
    this.branches = branches;
  }

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

  getWhereQuery(): WhereQuery | null {
    return this.whereQuery;
  }

  getOrderByQueries(): OrderByQueries {
    return this.orderByQueries;
  }
}
