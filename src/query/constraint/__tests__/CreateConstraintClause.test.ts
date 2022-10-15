import { CreateConstraintClause } from '../CreateConstraintClause';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { RelationshipPropertyExistenceConstraint } from '../RelationshipPropertyExistenceConstraint';
import { NodePropertyExistenceConstraint } from '../NodePropertyExistenceConstraint';
import { NodeKeyConstraint } from '../NodeKeyConstraint';
import { UniquenessConstraint } from '../UniquenessConstraint';
import { ConstraintInterface } from '../ConstraintInterface';

describe(`${CreateConstraintClause.name}`, () => {
  test.each([
    [
      new NodeKeyConstraint(new NodeLabel('User'), ['email']),
      'CREATE CONSTRAINT SPNL_nk_User_email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS NODE KEY',
    ],
    [
      new NodeKeyConstraint(new NodeLabel('User'), ['email', 'name']),
      'CREATE CONSTRAINT SPNL_nk_User_email_name IF NOT EXISTS FOR (e:User) REQUIRE (e.email, e.name) IS NODE KEY',
    ],
    [
      new NodePropertyExistenceConstraint(new NodeLabel('User'), 'email'),
      'CREATE CONSTRAINT SPNL_npe_User_email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS NOT NULL',
    ],
    [
      new RelationshipPropertyExistenceConstraint(
        new RelationshipType('HAS'),
        'userId'
      ),
      'CREATE CONSTRAINT SPNL_rpe_HAS_userId IF NOT EXISTS FOR ()-[e:HAS]-() REQUIRE e.userId IS NOT NULL',
    ],
    [
      new UniquenessConstraint(new NodeLabel('User'), 'email'),
      'CREATE CONSTRAINT SPNL_u_User_email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS UNIQUE',
    ],
  ])('get', (constraint: ConstraintInterface, expected: string) => {
    expect(new CreateConstraintClause(constraint).get()).toBe(expected);
  });
});
