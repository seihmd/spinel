import { parseFormula } from 'domain/graph/pattern/formula/parseFormula';
import { DirectionTerm } from 'domain/graph/pattern/term/DirectionTerm';
import { NodeKeyTerm } from 'domain/graph/pattern/term/NodeKeyTerm';
import { NodeLabelTerm } from 'domain/graph/pattern/term/NodeLabelTerm';
import { RelationshipKeyTerm } from 'domain/graph/pattern/term/RelationshipKeyTerm';
import { RelationshipTypeTerm } from 'domain/graph/pattern/term/RelationshipTypeTerm';
import { Term } from 'domain/graph/pattern/term/Term';

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
        return parseFormula('(:User)', 0);
      },
      [new NodeLabelTerm('(:User)')],
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
        return parseFormula('(user:User)<-[follows:FOLLOWS]-(user2:User)', 0);
      },
      [
        new NodeLabelTerm('(user:User)'),
        new DirectionTerm('<-'),
        new RelationshipTypeTerm('[follows:FOLLOWS]'),
        new DirectionTerm('-'),
        new NodeLabelTerm('(user2:User)'),
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
