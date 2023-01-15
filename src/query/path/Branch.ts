import { VariableSyntaxTranslator } from '../builder/find/statement/VariableSyntaxTranslator';
import { BranchFilter } from '../builder/find/where/BranchFilter';
import { WhereClause } from '../clause/WhereClause';
import { EntityElement } from '../element/Element';
import { NodeLiteral } from '../literal/NodeLiteral';
import { PathLiteral } from '../literal/PathLiteral';
import { PathStepLiteral } from '../literal/PathStepLiteral';
import { PatternComprehensionLiteral } from '../literal/PatternComprehensionLiteral';
import { BranchMaterialInterface } from '../meterial/branch/BranchMaterialInterface';
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

  getMaterial(): BranchMaterialInterface {
    return this.branchMaterial;
  }

  private getWhereClause(): WhereClause | null {
    if (this.branchFilter === null) {
      return null;
    }

    const variableSyntaxTranslator = VariableSyntaxTranslator.withPath(
      this.branchMaterial.getPath(),
      this.branchMaterial
    );

    return new WhereClause(
      this.branchFilter.getWhereStatement().translate(variableSyntaxTranslator)
    );
  }
}
