import { DirectionTerm } from '../../domain/graph/pattern/formula/DirectionTerm';
import { Direction } from '../../domain/graph/Direction';

export class DirectionElement {
  private term: DirectionTerm;

  constructor(term: DirectionTerm) {
    this.term = term;
  }

  getValue(): Direction {
    return this.term.getValue();
  }
}
