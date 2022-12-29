import { AssociationReferenceTerm } from 'domain/graph/pattern/term/AssociationReferenceTerm';

describe(`AssociationReferenceTerm`, () => {
  test('getKey', () => {
    expect(new AssociationReferenceTerm('.abc').getKey()).toStrictEqual('abc');
  });

  test.each([['n'], ['n.'], ['n.abc.'], [''], ['*.'], ['-'], ['->'], ['<-']])(
    'invalid values',
    (value: string) => {
      expect(() => {
        new AssociationReferenceTerm(value);
      }).toThrowError('Pattern has invalid value');
    }
  );
});
