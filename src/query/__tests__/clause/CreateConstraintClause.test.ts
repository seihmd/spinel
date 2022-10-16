import { NodeLabel } from '../../../domain/node/NodeLabel';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';
import { RelationshipPropertyExistenceConstraint } from '../../../domain/constraint/RelationshipPropertyExistenceConstraint';
import { NodePropertyExistenceConstraint } from '../../../domain/constraint/NodePropertyExistenceConstraint';
import { NodeKeyConstraint } from '../../../domain/constraint/NodeKeyConstraint';
import { UniquenessConstraint } from '../../../domain/constraint/UniquenessConstraint';
import { ConstraintInterface } from '../../../domain/constraint/ConstraintInterface';
import { CreateConstraintClause } from '../../clause/constraint/CreateConstraintClause';

describe(`${CreateConstraintClause.name}`, () => {
  test.each([
    [
      new NodeKeyConstraint(new NodeLabel('User'), ['email']),
      'CREATE CONSTRAINT SPNL_c_nk_User_email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS NODE KEY',
    ],
    [
      new NodeKeyConstraint(new NodeLabel('User'), ['email', 'name']),
      'CREATE CONSTRAINT SPNL_c_nk_User_email_name IF NOT EXISTS FOR (e:User) REQUIRE (e.email, e.name) IS NODE KEY',
    ],
    [
      new NodePropertyExistenceConstraint(new NodeLabel('User'), 'email'),
      'CREATE CONSTRAINT SPNL_c_npe_User_email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS NOT NULL',
    ],
    [
      new RelationshipPropertyExistenceConstraint(
        new RelationshipType('HAS'),
        'userId'
      ),
      'CREATE CONSTRAINT SPNL_c_rpe_HAS_userId IF NOT EXISTS FOR ()-[e:HAS]-() REQUIRE e.userId IS NOT NULL',
    ],
    [
      new UniquenessConstraint(new NodeLabel('User'), 'email'),
      'CREATE CONSTRAINT SPNL_c_u_User_email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS UNIQUE',
    ],
  ])('get', (constraint: ConstraintInterface, expected: string) => {
    expect(new CreateConstraintClause(constraint).get()).toBe(expected);
  });
});
