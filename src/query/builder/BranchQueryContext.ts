import { Branch } from 'query/path/Branch';

export class BranchQueryContext {
  private readonly branch: Branch;

  constructor(branch: Branch) {
    this.branch = branch;
  }

  getMapEntries(): [string, string][] {
    return [
      [
        this.branch.getGraphKey(),
        this.branch.toPatternComprehensionLiteral().get(),
      ],
    ];
  }
}
