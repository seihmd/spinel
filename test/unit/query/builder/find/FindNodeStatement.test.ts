import { NodeLabel } from 'domain/node/NodeLabel';
import { OrderByQueries } from 'query/builder/orderBy/OrderByQueries';
import { WhereQuery } from 'query/builder/where/WhereQuery';
import { NodeLiteral } from 'query/literal/NodeLiteral';
import { FindNodeStatement } from '../../../../../src/query/builder/find/FindNodeStatement';

describe(`${FindNodeStatement.name}`, () => {
  test('get', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      null,
      new OrderByQueries([])
    );

    expect(findNodeStatement.get('_')).toBe('MATCH (u:User) RETURN u{.*} AS _');
  });

  test('with WhereQuery', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      new WhereQuery(null, 'u.id = $id'),
      new OrderByQueries([])
    );

    expect(findNodeStatement.get('_')).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _'
    );
  });
});
