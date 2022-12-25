import { BranchFilter } from '../builder/where/BranchFilter';
import { WhereClause } from '../clause/WhereClause';
import { EntityElement } from '../element/Element';
import { NodeLiteral } from '../literal/NodeLiteral';
import { PathLiteral } from '../literal/PathLiteral';
import { PathStepLiteral } from '../literal/PathStepLiteral';
import { PatternComprehensionLiteral } from '../literal/PatternComprehensionLiteral';
import { VariableMap } from '../literal/util/VariableMap';
import { BranchMaterialInterface } from '../meterial/branch/BranchMaterialInterface';
import { FragmentBranchMaterial } from '../meterial/branch/FragmentBranchMaterial';
import { GraphBranchMaterial } from '../meterial/branch/GraphBranchMaterial';
import { Path } from './Path';

export class Branch {
  constructor(
    private readonly branchMaterial: BranchMaterialInterface,
    private readonly branchFilter: BranchFilter | null,
    private readonly branches: Branch[]
  ) {}

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

  getBranchFilter(): BranchFilter | null {
    return this.branchFilter;
  }

  private getWhereClause(): WhereClause | null {
    if (this.branchFilter === null) {
      return null;
    }

    return new WhereClause(
      this.branchFilter
        .getWhereStatement()
        .assign(
          VariableMap.withPath(
            this.branchMaterial.getPath(),
            this.branchMaterial instanceof GraphBranchMaterial ||
              this.branchMaterial instanceof FragmentBranchMaterial
          )
        )
    );
  }
}
