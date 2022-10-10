// CREATE CONSTRAINT constraint_name IF NOT EXISTS FOR (book:Book) REQUIRE book.isbn IS UNIQUE
// CREATE CONSTRAINT constraint_name IF NOT EXISTS FOR (book:Book) REQUIRE book.isbn IS NOT NULL
// CREATE CONSTRAINT constraint_name IF NOT EXISTS FOR ()-[like:LIKED]-() REQUIRE like.day IS NOT NULL
// CREATE CONSTRAINT constraint_name IF NOT EXISTS FOR (n:Person) REQUIRE (n.firstname, n.surname) IS NODE KEY

import { CreateConstraintClause } from '../CreateConstraintClause';
import { UniquenessConstraint } from '../../../../test/functional/query/constraint/UniquenessConstraint';
import { NodeLabel } from '../../../domain/node/NodeLabel';
import { ConstraintInterface } from '../../../../test/functional/query/constraint/ConstraintInterface';
import { NodeKeyConstraint } from '../../../../test/functional/query/constraint/NodeKeyConstraint';
import { NodePropertyExistenceConstraint } from '../../../../test/functional/query/constraint/NodePropertyExistenceConstraint';
import { RelationshipPropertyExistenceConstraint } from '../../../../test/functional/query/constraint/RelationshipPropertyExistenceConstraint';
import { RelationshipType } from '../../../domain/relationship/RelationshipType';

describe(`${CreateConstraintClause.name}`, () => {
  test.each([
    [
      new NodeKeyConstraint(new NodeLabel('User'), ['email']),
      'CREATE CONSTRAINT SPNL-nk-User-email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS NODE KEY',
    ],
    [
      new NodeKeyConstraint(new NodeLabel('User'), ['email', 'name']),
      'CREATE CONSTRAINT SPNL-nk-User-email-name IF NOT EXISTS FOR (e:User) REQUIRE (e.email, e.name) IS NODE KEY',
    ],
    [
      new NodePropertyExistenceConstraint(new NodeLabel('User'), 'email'),
      'CREATE CONSTRAINT SPNL-npe-User-email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS NOT NULL',
    ],
    [
      new RelationshipPropertyExistenceConstraint(
        new RelationshipType('HAS'),
        'userId'
      ),
      'CREATE CONSTRAINT SPNL-rpe-HAS-userId IF NOT EXISTS FOR ()-[e:HAS]-() REQUIRE e.userId IS NOT NULL',
    ],
    [
      new UniquenessConstraint(new NodeLabel('User'), 'email'),
      'CREATE CONSTRAINT SPNL-u-User-email IF NOT EXISTS FOR (e:User) REQUIRE e.email IS UNIQUE',
    ],
  ])('get', (constraint: ConstraintInterface, expected: string) => {
    expect(new CreateConstraintClause(constraint).get()).toBe(expected);
  });
});
