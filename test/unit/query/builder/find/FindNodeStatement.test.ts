import { NodeLabel } from 'domain/node/NodeLabel';
import { OrderByQueries } from 'query/builder/orderBy/OrderByQueries';
import { NodeLiteral } from 'query/literal/NodeLiteral';
import { FindNodeStatement } from '../../../../../src/query/builder/find/FindNodeStatement';
import { WhereStatement } from '../../../../../src/query/clause/where/WhereStatement';

describe(`${FindNodeStatement.name}`, () => {
  test('get', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      null,
      new OrderByQueries([])
    );

    expect(findNodeStatement.get()).toBe('MATCH (u:User) RETURN u{.*} AS _');
  });

  test('with WhereQuery', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      new WhereStatement('u.id = $id'),
      new OrderByQueries([])
    );

    expect(findNodeStatement.get()).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _'
    );
  });
});
