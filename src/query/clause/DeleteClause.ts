export class DeleteClause {
  private readonly variableName: string;
  private readonly detach: boolean;

  constructor(variableName: string, detach: boolean) {
    this.variableName = variableName;
    this.detach = detach;
  }

  get(): string {
    return `${this.detach ? 'DETACH ' : ''}DELETE ${this.variableName}`;
  }
}
