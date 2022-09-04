import { PatternTerm } from './PatternTerm';

export class RelationshipKeyTerm extends PatternTerm {
  constructor(value: string) {
    super(value);

    this.assert();
  }

  getKey(): string {
    return this.value;
  }

  private assert(): void {
    if (this.isDirection() || this.isBranchEnd() || this.hasModifier()) {
      this.throwInvalidValueError();
    }
  }
}
