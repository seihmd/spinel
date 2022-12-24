import { EntityTerm } from './EntityTerm';
import { BRANCH_END } from './modifiers';

export class BranchEndTerm extends EntityTerm {
  private readonly key: string | null;

  constructor(value: string) {
    super(value);

    const s = this.value.split(/\.(.*)/s);
    if (s.length === 1) {
      this.key = null;
    } else {
      this.key = s[1];
    }

    this.assert();
  }

  getKey(): string | null {
    return this.key;
  }

  private assert(): void {
    if (this.value === BRANCH_END) {
      return;
    }

    if (this.key !== null && this.key.length > 0) {
      return;
    }

    this.throwInvalidValueError();
  }
}
