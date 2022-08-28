import { PatternComprehensionLiteral } from '../literal/PatternComprehensionLiteral';
import { PathLiteral } from '../literal/PathLiteral';
import { NodeLiteral } from '../literal/NodeLiteral';
import { PathStepLiteral } from '../literal/PathStepLiteral';
import { GraphParameter } from '../parameter/GraphParameter';
import { BranchMaterial } from '../meterial/BranchMaterial';
import { EntityElement } from '../element/Element';
import { WhereQuery } from '../builder/where/WhereQuery';
import { WhereClause } from '../clause/WhereClause';
import { WhereLiteral } from '../literal/WhereLiteral';

export class Branch {
  private readonly branchMaterial: BranchMaterial;
  private readonly whereQuery: WhereQuery | null;
  private readonly branches: Branch[];

  constructor(
    branchMaterial: BranchMaterial,
    whereQuery: WhereQuery | null,
    branches: Branch[]
  ) {
    this.branchMaterial = branchMaterial;
    this.branches = branches;
    this.whereQuery = whereQuery;
  }

  toPatternComprehensionLiteral(
    graphParameter: GraphParameter
  ): PatternComprehensionLiteral {
    return new PatternComprehensionLiteral(
      new PathLiteral(
        new NodeLiteral(this.branchMaterial.getRootVariableName(), null, null),
        this.branchMaterial.getSteps().map((step) => {
          return PathStepLiteral.new(step, graphParameter);
        })
      ),
      this.getWhereClause(),
      this.branchMaterial.getFilter(this.branches)
    );
  }

  getGraphKey() {
    return this.branchMaterial.getGraphKey();
  }

  getBranches(): Branch[] {
    return this.branches;
  }

  getEntityElements(): EntityElement[] {
    return this.branchMaterial.getPath().getEntityElements();
  }

  getWhereQuery(): WhereQuery | null {
    return this.whereQuery;
  }

  private getWhereClause(): WhereClause | null {
    if (this.whereQuery === null) {
      return null;
    }

    const whereLiteral = WhereLiteral.new(
      this.whereQuery.getQuery(),
      this.branchMaterial.getPath()
    );

    return new WhereClause(whereLiteral);
  }
}
