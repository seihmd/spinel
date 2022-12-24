import { PatternTerm } from './PatternTerm';

export abstract class EntityKeyTerm extends PatternTerm {
  getKey(): string {
    return this.value;
  }
}
