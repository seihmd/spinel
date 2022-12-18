import { NodeLabel } from 'domain/node/NodeLabel';
import { OrderByQueries } from 'query/builder/orderBy/OrderByQueries';
import { NodeLiteral } from 'query/literal/NodeLiteral';
import { PositiveInt } from '../../../../../src/domain/type/PositiveInt';
import { FindNodeStatement } from '../../../../../src/query/builder/find/FindNodeStatement';
import { LimitClause } from '../../../../../src/query/clause/LimitClause';
import { WhereStatement } from '../../../../../src/query/clause/where/WhereStatement';

describe(`FindNodeStatement`, () => {
  test('get', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      null,
      new OrderByQueries([]),
      null
    );

    expect(findNodeStatement.get()).toBe('MATCH (u:User) RETURN u{.*} AS _');
  });

  test('with WhereQuery', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      new WhereStatement('u.id = $id'),
      new OrderByQueries([]),
      null
    );

    expect(findNodeStatement.get()).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _'
    );
  });

  test('with Limit', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      new WhereStatement('u.id = $id'),
      new OrderByQueries([]),
      new LimitClause(new PositiveInt(3))
    );

    expect(findNodeStatement.get()).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _ LIMIT 3'
    );
  });
});
