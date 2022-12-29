import { RelationshipTypeTerm } from 'domain/graph/pattern/term/RelationshipTypeTerm';

describe(`${RelationshipTypeTerm.name}`, () => {
  test.each([
    ['[:rel]', null, 'rel'],
    ['[var:rel]', 'var', 'rel'],
    ['[var]', 'var', null],
    ['[]', null, null],
  ])(
    'valid value',
    (value: string, alias: string | null, type: string | null) => {
      const relationshipTypeTerm = new RelationshipTypeTerm(value);
      expect(relationshipTypeTerm.getAlias()).toBe(alias);
      expect(relationshipTypeTerm.getType()).toBe(type);
    }
  );

  test.each([[''], ['[:]'], ['[{}]'], ['rel']])(
    'invalid value will throw error',
    (value: string) => {
      expect(() => {
        new RelationshipTypeTerm(value);
      }).toThrowError();
    }
  );
});
