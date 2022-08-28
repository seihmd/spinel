import { DirectionTerm } from '../term/DirectionTerm';
import { LEFT, NONE, RIGHT } from '../../Direction';
import { NodeLabelTerm } from '../term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../term/RelationshipTypeTerm';
import { BRANCH_END, LabelPrefix } from '../term/PatternTerm';
import { Term } from '../term/Term';
import { PatternIndex } from '../term/PatternIndex';
import { RelationshipKeyTerm } from '../term/RelationshipKeyTerm';
import { NodeKeyTerm } from '../term/NodeKeyTerm';
import { BranchEndTerm } from '../term/BranchEndTerm';

export function parseFormula(formula: string, start: 0 | 1): Term[] {
  const values = formula
    .split(new RegExp(`(${LEFT}|${RIGHT}|${NONE})`, 'g'))
    .filter((value) => value !== '');

  return values.map((value, index) => {
    const patternIndex = new PatternIndex(start + index);
    if (patternIndex.isNode()) {
      if (value.startsWith(LabelPrefix)) {
        return new NodeLabelTerm(value);
      }

      if (value.startsWith(BRANCH_END)) {
        return new BranchEndTerm(value);
      }

      return new NodeKeyTerm(value);
    } else if (patternIndex.isRelationship()) {
      if (value.startsWith(LabelPrefix)) {
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
