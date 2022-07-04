import { LabelPrefix, PatternTerm } from './PatternTerm';
import { PatternIndex } from './PatternIndex';
import { RelationshipKeyTerm } from './RelationshipKeyTerm';
import { DirectionTerm } from './DirectionTerm';
import { NodeLabelTerm } from './NodeLabelTerm';
import { RelationshipTypeTerm } from './RelationshipTypeTerm';
import { LEFT, NONE, RIGHT } from '../../Direction';
import { NodeKeyTerm } from './NodeKeyTerm';

export class PatternFormula {
  private readonly terms: PatternTerm[];

  constructor(value: string) {
    const normalized = this.normalize(value);
    const terms = this.parse(normalized);

    this.assert(terms);

    this.terms = terms;
  }

  get(): PatternTerm[] {
    return this.terms;
  }

  private parse(description: string): PatternTerm[] {
    const values = description.split(
      new RegExp(`(${LEFT}|${RIGHT}|${NONE})`, 'g')
    );

    return values.map((value, index) => {
      const patternIndex = new PatternIndex(index);
      if (patternIndex.isNode()) {
        if (value.startsWith(LabelPrefix)) {
          return new NodeLabelTerm(value, patternIndex);
        }

        return new NodeKeyTerm(value, patternIndex);
      } else if (patternIndex.isRelationship()) {
        if (value.startsWith(LabelPrefix)) {
          return new RelationshipTypeTerm(value, patternIndex);
        }

        return new RelationshipKeyTerm(value, patternIndex);
      } else {
        return new DirectionTerm(value, patternIndex);
      }
    });
  }

  private normalize(description: string): string {
    return description.replace(/( |\r\n|\n|\r)/gm, '');
  }

  private assert(terms: PatternTerm[]) {
    const keys = terms
      .filter(
        (term): boolean =>
          term instanceof NodeKeyTerm || term instanceof RelationshipKeyTerm
      )
      .map((term) => term.getValue());

    if (new Set(keys).size !== keys.length) {
      throw new Error(`Pattern has duplicate keys.`);
    }
  }
}
