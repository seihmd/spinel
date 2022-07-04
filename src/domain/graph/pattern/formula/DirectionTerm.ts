import { PatternTerm } from './PatternTerm';
import { PatternIndex } from './PatternIndex';
import { Direction, LEFT, NONE, RIGHT } from '../../Direction';

export class DirectionTerm extends PatternTerm {
  constructor(value: string, index: PatternIndex) {
    super(value, index);

    this.assert();
  }

  getValue(): Direction {
    return this.value as Direction;
  }

  getVariableName(): string {
    return '';
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

  private assert(): void {
    if (!this.isDirection()) {
      throw new Error('Pattern has invalid value.');
    }

    if (!this.index.isDirection()) {
      throw new Error('Pattern has invalid value.');
    }

    // Do not accept pattern like "Node->RELATIONSHIP"
    if (this.index.isBetweenNodeAndRelationship() && this.value === RIGHT) {
      throw new Error('Pattern has invalid value');
    }

    // Do not accept pattern like "RELATIONSHIP<-Node"
    if (this.index.isBetweenRelationshipAndNode() && this.value === LEFT) {
      throw new Error('Pattern has invalid value');
    }
  }
}
