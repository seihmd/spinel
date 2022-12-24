import { EntityKeyTerm } from './EntityKeyTerm';

export class RelationshipKeyTerm extends EntityKeyTerm {
  constructor(value: string) {
    super(value);

    if (!/^\w+$/.test(value)) {
      this.throwInvalidValueError();
    }
  }
}
