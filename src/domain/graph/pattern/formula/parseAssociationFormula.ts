import { LEFT, NONE, RIGHT } from '../../Direction';
import { AssociationReferenceTerm } from '../term/AssociationReferenceTerm';
import { DirectionTerm } from '../term/DirectionTerm';
import { NodeKeyTerm } from '../term/NodeKeyTerm';
import { NodeLabelTerm } from '../term/NodeLabelTerm';
import { PatternIndex } from '../term/PatternIndex';
import { RelationshipKeyTerm } from '../term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from '../term/RelationshipTypeTerm';
import { Term } from '../term/Term';

export function parseAssociationFormula(formula: string, start: 0 | 1): Term[] {
  const values = formula
    .split(new RegExp(`(${LEFT}|${RIGHT}|${NONE})`, 'g'))
    .filter((value) => value !== '');

  return values.map((value, index) => {
    const patternIndex = new PatternIndex(start + index);
    if (patternIndex.isNode()) {
      if (NodeLabelTerm.maybe(value)) {
        return new NodeLabelTerm(value);
      }

      if (index === values.length - 1) {
        return new AssociationReferenceTerm(value);
      }

      return new NodeKeyTerm(value);
    } else if (patternIndex.isRelationship()) {
      if (RelationshipTypeTerm.maybe(value)) {
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
