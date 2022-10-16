import { RelationshipPropertyExistenceConstraint } from '../RelationshipPropertyExistenceConstraint';
import { RelationshipType } from '../../relationship/RelationshipType';

describe(`${RelationshipPropertyExistenceConstraint.name}`, () => {
  test('getName', () => {
    expect(
      new RelationshipPropertyExistenceConstraint(
        new RelationshipType('HAS'),
        'userId'
      ).getName()
    ).toBe('SPNL_c_rpe_HAS_userId');
  });
});
