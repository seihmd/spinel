import { EntityKeyTerm } from './EntityKeyTerm';

export class NodeKeyTerm extends EntityKeyTerm {
  constructor(value: string) {
    super(value);

    if (!/^\w+$/.test(value)) {
      this.throwInvalidValueError();
    }
  }

  getKey(): string {
    return this.value;
  }
}
