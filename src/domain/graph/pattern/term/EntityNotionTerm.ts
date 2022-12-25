import { PatternTerm } from './PatternTerm';

export const LABEL_PREFIX = ':';

export abstract class EntityNotionTerm extends PatternTerm {
  getKey(): null {
    return null;
  }
}
