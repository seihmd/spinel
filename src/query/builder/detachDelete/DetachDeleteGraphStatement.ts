import { CallSubqueryClause } from '../../clause/CallSubqueryClause';
import { DeleteClause } from '../../clause/DeleteClause';
import { MatchNodeClause } from '../../clause/MatchNodeClause';
import { isAnyNodeElement } from '../../element/Element';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { Path } from '../../path/Path';
import { AbstractStatement } from '../AbstractStatement';

export class DetachDeleteGraphStatement extends AbstractStatement {
  private readonly stemPath: Path;
  private readonly branchPaths: Path[];

  constructor(stemPath: Path, branchPaths: Path[]) {
    super();
    this.stemPath = stemPath;
    this.branchPaths = branchPaths;
  }

  protected build(): string {
    const matchStatement = [
      ...this.getMatchNodeClauses().map((m) => {
        return m.get();
      }),
    ].join(' ');

    const detachDeleteClauses = this.getDetachDeleteClauses();

    const withClause =
      'WITH ' + detachDeleteClauses.map((c) => c.getVariableName()).join(',');
    const detachDeleteStatement = detachDeleteClauses
      .map((c) => c.get())
      .join(' ');
    const callSubqueryClause = new CallSubqueryClause(
      `${withClause} ${detachDeleteStatement}`,
      true
    );

    return `${matchStatement} ${callSubqueryClause.get()}`;
  }

  private getMatchNodeClauses(): MatchNodeClause[] {
    return [
      ...this.stemPath
        .getInstanceElements()
        .filter((instanceElement): instanceElement is NodeInstanceElement =>
          isAnyNodeElement(instanceElement)
        )
        .map((nodeInstanceElement) => {
          return new MatchNodeClause(
            NodeLiteral.new(
              nodeInstanceElement,
              nodeInstanceElement.getPrimaries()
            )
          );
        }),
      ...this.branchPaths
        .map((branchPath) =>
          branchPath
            .getInstanceElements(false)
            .filter((instanceElement): instanceElement is NodeInstanceElement =>
              isAnyNodeElement(instanceElement)
            )
            .map((nodeInstanceElement) => {
              return new MatchNodeClause(
                NodeLiteral.new(
                  nodeInstanceElement,
                  nodeInstanceElement.getPrimaries()
                )
              );
            })
        )
        .flat(),
    ];
  }

  private getDetachDeleteClauses(): DeleteClause[] {
    return [
      ...this.stemPath
        .getInstanceElements()
        .map((element) => new DeleteClause(element.getVariableName(), true)),
      ...this.branchPaths
        .map((branchPath) =>
          branchPath
            .getInstanceElements(false)
            .map((element) => new DeleteClause(element.getVariableName(), true))
        )
        .flat(),
    ];
  }
}
