import { RelationshipPropertyExistenceConstraint } from '../RelationshipPropertyExistenceConstraint';
import { RelationshipType } from '../../../../../src/domain/relationship/RelationshipType';

describe(`${RelationshipPropertyExistenceConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new RelationshipPropertyExistenceConstraint(
        new RelationshipType('HAS'),
        'userId'
      ).getName()
    ).toBe('SPNL-rpe-HAS-userId');
  });
});
