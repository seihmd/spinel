import { LEFT, NONE, RIGHT } from '../../Direction';
import { BranchEndTerm } from '../term/BranchEndTerm';
import { DirectionTerm } from '../term/DirectionTerm';
import { BRANCH_END, LABEL_PREFIX } from '../term/modifiers';
import { NodeKeyTerm } from '../term/NodeKeyTerm';
import { NodeLabelTerm } from '../term/NodeLabelTerm';
import { PatternIndex } from '../term/PatternIndex';
import { RelationshipKeyTerm } from '../term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from '../term/RelationshipTypeTerm';
import { Term } from '../term/Term';

export function parseFormula(formula: string, start: 0 | 1): Term[] {
  const values = formula
    .split(new RegExp(`(${LEFT}|${RIGHT}|${NONE})`, 'g'))
    .filter((value) => value !== '');

  return values.map((value, index) => {
    const patternIndex = new PatternIndex(start + index);
    if (patternIndex.isNode()) {
      if (value.startsWith(LABEL_PREFIX)) {
        return new NodeLabelTerm(value);
      }

      if (value.startsWith(BRANCH_END)) {
        return new BranchEndTerm(value);
      }

      return new NodeKeyTerm(value);
    } else if (patternIndex.isRelationship()) {
      if (value.startsWith(LABEL_PREFIX)) {
        return new RelationshipTypeTerm(value);
      }

      return new RelationshipKeyTerm(value);
    } else {
      // Do not accept pattern like "Node->RELATIONSHIP"
      if (patternIndex.isBetweenNodeAndRelationship() && value === RIGHT) {
        throw new Error('Pattern has invalid value');
      }

      // Do not accept pattern like "RELATIONSHIP<-Node"
      if (patternIndex.isBetweenRelationshipAndNode() && value === LEFT) {
        throw new Error('Pattern has invalid value');
      }
      return new DirectionTerm(value);
    }
  });
}
