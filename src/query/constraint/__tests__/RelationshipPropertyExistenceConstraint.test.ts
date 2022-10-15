import { RelationshipPropertyExistenceConstraint } from '../RelationshipPropertyExistenceConstraint';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';

describe(`${RelationshipPropertyExistenceConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new RelationshipPropertyExistenceConstraint(
        new RelationshipType('HAS'),
        'userId'
      ).getName()
    ).toBe('SPNL_rpe_HAS_userId');
  });
});
