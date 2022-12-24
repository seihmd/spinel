import { EntityTerm } from './EntityTerm';

export class NodeKeyTerm extends EntityTerm {
  constructor(value: string) {
    super(value);

    this.assert();
  }

  getKey(): string {
    return this.value;
  }

  private assert(): void {
    if (this.isDirection() || this.isBranchEnd() || this.hasAlias()) {
      this.throwInvalidValueError();
    }
  }
}
