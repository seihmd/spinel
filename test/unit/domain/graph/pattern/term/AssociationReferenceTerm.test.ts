import { AssociationReferenceTerm } from 'domain/graph/pattern/term/AssociationReferenceTerm';

describe(`AssociationReferenceTerm`, () => {
  test.each([
    ['n', ['n']],
    ['n.abc', ['n', 'abc']],
    ['n.abc.de', ['n', 'abc', 'de']],
  ])('getKeys', (value: string, expected: string[]) => {
    expect(new AssociationReferenceTerm(value).getKeys()).toStrictEqual(
      expected
    );
  });

  test.each([['n.'], ['n.abc.'], [''], ['*.'], ['.'], ['-'], ['->'], ['<-']])(
    'invalid values',
    (value: string) => {
      expect(() => {
        new AssociationReferenceTerm(value);
      }).toThrowError('Pattern has invalid value');
    }
  );
});
