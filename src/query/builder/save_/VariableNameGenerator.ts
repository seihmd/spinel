export class VariableNameGenerator {
  private nodeIndex = 0;
  private relationshipIndex = 0;

  getNodeVariableName(): string {
    return `n${this.nodeIndex++}`;
  }

  getRelationshipVariableName(): string {
    return `r${this.relationshipIndex++}`;
  }
}
