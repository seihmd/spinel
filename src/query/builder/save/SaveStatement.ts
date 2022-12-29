import { MergeEntityClause } from '../../clause/MergeEntityClause';
import { MergeGraphClause } from '../../clause/MergeGraphClause';
import { SetClause } from '../../clause/SetClause';
import { isAnyNodeElement } from '../../element/Element';
import { NodeInstanceElement } from '../../element/NodeInstanceElement';
import { NodeLiteral } from '../../literal/NodeLiteral';
import { Path } from '../../path/Path';
import { AbstractStatement } from '../AbstractStatement';

export class SaveStatement extends AbstractStatement {
  private readonly stemPath: Path;
  private readonly branchPaths: Path[];

  constructor(stemPath: Path, branchPaths: Path[]) {
    super();
    this.stemPath = stemPath;
    this.branchPaths = branchPaths;
  }

  protected build(): string {
    const mergeQuery = [
      ...this.getMergeEntityClauses().map((m) => {
        return m.get();
      }),
      ...this.getMergeGraphClauses().map((m) => {
        return m.get();
      }),
    ].join(' ');

    const setQuery = this.getSetClauses()
      .map((setClause) => setClause.get())
      .join(' ');

    return `${mergeQuery} ${setQuery}`;
  }

  private getMergeEntityClauses(): MergeEntityClause[] {
    return [
      ...this.stemPath
        .getInstanceElements()
        .filter((instanceElement): instanceElement is NodeInstanceElement =>
          isAnyNodeElement(instanceElement)
        )
        .map((nodeInstanceElement) => {
          return new MergeEntityClause(
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
              return new MergeEntityClause(
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

  private getMergeGraphClauses(): MergeGraphClause[] {
    return [this.stemPath, ...this.branchPaths]
      .filter((path) => path.getSteps().length > 0)
      .map((path) => new MergeGraphClause(path));
  }

  private getSetClauses(): SetClause[] {
    return [
      ...this.stemPath
        .getInstanceElements()
        .map(
          (element) =>
            new SetClause(
              element.getVariableName(),
              element.getPropertiesParameter()
            )
        ),
      ...this.branchPaths
        .map((branchPath) =>
          branchPath
            .getInstanceElements(false)
            .map(
              (element) =>
                new SetClause(
                  element.getVariableName(),
                  element.getPropertiesParameter()
                )
            )
        )
        .flat(),
    ];
  }
}
