import { snakeCase } from 'snake-case';
import { AnyClassConstructor } from '../type/ClassConstructor';

export class RelationshipType {
  private readonly value: string;

  constructor(value: string | AnyClassConstructor) {
    if (typeof value === 'string') {
      if (value.length === 0) {
        throw new Error('Relationship Type must be at least 1 character');
      }

      this.value = value;
    } else {
      this.value = snakeCase(value.name).toUpperCase();
    }
  }

  toString(): string {
    return this.value;
  }
}
