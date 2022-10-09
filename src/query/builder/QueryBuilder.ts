import { AnyClassConstructor } from '../../domain/type/ClassConstructor';
import { StemQueryContext } from './StemQueryContext';
import { BranchQueryContext } from './BranchQueryContext';
import { Query } from './Query';
import { StemBuilder } from './StemBuilder';
import { Depth } from '../../domain/graph/branch/Depth';
import { WhereQueries } from './where/WhereQueries';

export class QueryBuilder {
  private readonly stemBuilder: StemBuilder;

  constructor(stemBuilder: StemBuilder) {
    this.stemBuilder = stemBuilder;
  }

  build(
    cstr: AnyClassConstructor,
    whereQueries: WhereQueries,
    depth: Depth = Depth.withDefault()
  ) {
    const stem = this.stemBuilder.build(cstr, whereQueries, depth);
    const stemQueryContext = new StemQueryContext(stem, depth);
    const branchQueryContexts = stem.getBranches().map((branch) => {
      return new BranchQueryContext(branch);
    });

    return new Query(stemQueryContext, branchQueryContexts);
  }
}