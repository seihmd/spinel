import { Branch } from 'query/path/Branch';
import { GraphParameter } from '../parameter/GraphParameter';

export class BranchQueryContext {
  private readonly branch: Branch;
  private readonly graphParameter: GraphParameter;

  constructor(branch: Branch, graphParameter: GraphParameter) {
    this.branch = branch;
    this.graphParameter = graphParameter;
  }

  getMapEntries(): [string, string][] {
    return [
      [
        this.branch.getGraphKey(),
        this.branch.toPatternComprehensionLiteral(this.graphParameter).get(),
      ],
    ];
  }
}
