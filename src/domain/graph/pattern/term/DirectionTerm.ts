import { Direction, LEFT, NONE, RIGHT } from '../../Direction';
import { PatternTerm } from './PatternTerm';

export class DirectionTerm extends PatternTerm {
  constructor(value: string) {
    super(value);

    this.assert();
  }

  getValue(): Direction {
    return this.value as Direction;
  }

  //
  // getVariableName(): string {
  //   return '';
  // }

  getKey(): null {
    return null;
  }

  isLeft(): boolean {
    return this.value === LEFT;
  }

  isRight(): boolean {
    return this.value === RIGHT;
  }

  isNone(): boolean {
    return this.value === NONE;
  }

  reverse(): DirectionTerm {
    if (this.value === LEFT) {
      return new DirectionTerm(RIGHT);
    }
    if (this.value === RIGHT) {
      return new DirectionTerm(LEFT);
    }
    return new DirectionTerm(NONE);
  }

  private assert(): void {
    if (!this.isDirection()) {
      this.throwInvalidValueError();
    }
  }
}
