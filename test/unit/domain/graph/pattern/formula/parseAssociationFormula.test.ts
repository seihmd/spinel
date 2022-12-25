import { parseAssociationFormula } from 'domain/graph/pattern/formula/parseAssociationFormula';
import { DirectionTerm } from 'domain/graph/pattern/term/DirectionTerm';
import { RelationshipTypeTerm } from 'domain/graph/pattern/term/RelationshipTypeTerm';
import { Term } from 'domain/graph/pattern/term/Term';
import { AssociationReferenceTerm } from '../../../../../../src/domain/graph/pattern/term/AssociationReferenceTerm';
import { NodeKeyTerm } from '../../../../../../src/domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from '../../../../../../src/domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from '../../../../../../src/domain/graph/pattern/term/RelationshipKeyTerm';

describe('parseAssociationFormula', () => {
  test.each([
    [
      (): Term[] => {
        return parseAssociationFormula('n1-r->n2', 0);
      },
      [
        new NodeKeyTerm('n1'),
        new DirectionTerm('-'),
        new RelationshipKeyTerm('r'),
        new DirectionTerm('->'),
        new AssociationReferenceTerm('n2'),
      ],
    ],
    [
      (): Term[] => {
        return parseAssociationFormula('user<-[:FOLLOWS]-items.item', 0);
      },
      [
        new NodeKeyTerm('user'),
        new DirectionTerm('<-'),
        new RelationshipTypeTerm('[:FOLLOWS]'),
        new DirectionTerm('-'),
        new AssociationReferenceTerm('items.item'),
      ],
    ],
    [
      (): Term[] => {
        return parseAssociationFormula('user<-[:FOLLOWS]-(item:Item)', 0);
      },
      [
        new NodeKeyTerm('user'),
        new DirectionTerm('<-'),
        new RelationshipTypeTerm('[:FOLLOWS]'),
        new DirectionTerm('-'),
        new NodeLabelTerm('(item:Item)'),
      ],
    ],
  ])('parse valid formula', (parse: () => Term[], expected: Term[]) => {
    expect(parse()).toStrictEqual(expected);
  });

  test.each([
    ['n1', 1],
    ['-r->n2', 0],
    ['n1--r->n2', 0],
    ['n1-r<-n2', 0],
    ['n1->r-n2', 0],
  ] as [string, 0 | 1][])(
    'parse invalid formula',
    (formula: string, startIndex: 0 | 1) => {
      expect(() => {
        return parseAssociationFormula(formula, startIndex);
      }).toThrowError();
    }
  );
});
