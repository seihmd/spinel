import { parseFormula } from '../../../../graph/pattern/formula/parseFormula';
import { DirectionTerm } from '../../../../graph/pattern/term/DirectionTerm';
import { Term } from '../../../../graph/pattern/term/Term';
import { NodeLabelTerm } from '../../../../graph/pattern/term/NodeLabelTerm';
import { RelationshipTypeTerm } from '../../../../graph/pattern/term/RelationshipTypeTerm';
import { RelationshipKeyTerm } from '../../../../graph/pattern/term/RelationshipKeyTerm';
import { NodeKeyTerm } from '../../../../graph/pattern/term/NodeKeyTerm';
import { BranchEndTerm } from '../../../../graph/pattern/term/BranchEndTerm';

describe('parseFormula', () => {
  test.each([
    [
      (): Term[] => {
        return parseFormula('n1', 0);
      },
      [new NodeKeyTerm('n1')],
    ],
    [
      (): Term[] => {
        return parseFormula(':User', 0);
      },
      [new NodeLabelTerm(':User')],
    ],
    [
      (): Term[] => {
        return parseFormula('n1-r->n2', 0);
      },
      [
        new NodeKeyTerm('n1'),
        new DirectionTerm('-'),
        new RelationshipKeyTerm('r'),
        new DirectionTerm('->'),
        new NodeKeyTerm('n2'),
      ],
    ],
    [
      (): Term[] => {
        return parseFormula(':User@user<-:FOLLOWS@follows-:User@user2', 0);
      },
      [
        new NodeLabelTerm(':User@user'),
        new DirectionTerm('<-'),
        new RelationshipTypeTerm(':FOLLOWS@follows'),
        new DirectionTerm('-'),
        new NodeLabelTerm(':User@user2'),
      ],
    ],
    [
      (): Term[] => {
        return parseFormula('-r->n2', 1);
      },
      [
        new DirectionTerm('-'),
        new RelationshipKeyTerm('r'),
        new DirectionTerm('->'),
        new NodeKeyTerm('n2'),
      ],
    ],
    [
      (): Term[] => {
        return parseFormula('n1-r->*', 0);
      },
      [
        new NodeKeyTerm('n1'),
        new DirectionTerm('-'),
        new RelationshipKeyTerm('r'),
        new DirectionTerm('->'),
        new BranchEndTerm('*'),
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
        return parseFormula(formula, startIndex);
      }).toThrowError();
    }
  );
});
