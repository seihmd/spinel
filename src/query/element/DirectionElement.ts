import { Direction } from '../../domain/graph/Direction';
import { DirectionTerm } from '../../domain/graph/pattern/term/DirectionTerm';

export class DirectionElement {
  private readonly term: DirectionTerm;

  constructor(term: DirectionTerm) {
    this.term = term;
  }

  getValue(): Direction {
    return this.term.getValue();
  }

  reverse(): DirectionElement {
    if (this.term.getValue() === '-') {
      return new DirectionElement(this.term);
    }

    if (this.term.getValue() === '<-') {
      return new DirectionElement(new DirectionTerm('->'));
    }

    return new DirectionElement(new DirectionTerm('<-'));
  }
}
