import { PatternComprehensionLiteral } from '../literal/PatternComprehensionLiteral';
import { PathLiteral } from '../literal/PathLiteral';
import { NodeLiteral } from '../literal/NodeLiteral';
import { PathStepLiteral } from '../literal/PathStepLiteral';
import { EntityElement } from '../element/Element';
import { WhereQuery } from '../builder/where/WhereQuery';
import { WhereClause } from '../clause/WhereClause';
import { WhereLiteral } from '../literal/WhereLiteral';
import { BranchMaterialInterface } from '../meterial/branch/BranchMaterialInterface';
import { Path } from './Path';

export class Branch {
  private readonly branchMaterial: BranchMaterialInterface;
  private readonly whereQuery: WhereQuery | null;
  private readonly branches: Branch[];

  constructor(
    branchMaterial: BranchMaterialInterface,
    whereQuery: WhereQuery | null,
    branches: Branch[]
  ) {
    this.branchMaterial = branchMaterial;
    this.branches = branches;
    this.whereQuery = whereQuery;
  }

  toPatternComprehensionLiteral(): PatternComprehensionLiteral {
    return new PatternComprehensionLiteral(
      new PathLiteral(
        new NodeLiteral(this.branchMaterial.getRootVariableName(), null, null),
        this.branchMaterial.getSteps().map((step) => {
          return PathStepLiteral.new(step);
        })
      ),
      this.getWhereClause(),
      this.branchMaterial.getFilter(this.branches)
    );
  }

  getPaths(): Path[] {
    let paths: Path[] = [this.branchMaterial.getPath()];
    this.getBranches().forEach((branch) => {
      paths = [...paths, ...branch.getPaths()];
    });

    return paths;
  }

  getGraphKey(): string {
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
