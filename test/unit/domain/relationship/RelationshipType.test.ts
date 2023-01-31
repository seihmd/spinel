import { RelationshipType } from 'domain/relationship/RelationshipType';

describe('Type', () => {
  test('when passing string, set it as value', () => {
    const t = new RelationshipType('TestType');

    expect(t.toString()).toBe('TestType');
  });

  test('type must be at least 1 character', () => {
    expect(() => new RelationshipType('')).toThrowError(
      'Relationship Type must be at least 1 character'
    );
  });
});
