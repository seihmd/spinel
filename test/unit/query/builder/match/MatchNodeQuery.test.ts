import { NodeLabel } from 'domain/node/NodeLabel';
import { MatchNodeQuery } from 'query/builder/match/MatchNodeQuery';
import { OrderByQueries } from 'query/builder/orderBy/OrderByQueries';
import { WhereQuery } from 'query/builder/where/WhereQuery';
import { NodeLiteral } from 'query/literal/NodeLiteral';

describe(`${MatchNodeQuery.name}`, () => {
  test('get', () => {
    const matchNodeQuery = new MatchNodeQuery(
      new NodeLiteral('u', new NodeLabel('User'), null),
      null,
      new OrderByQueries([])
    );

    expect(matchNodeQuery.get('_')).toBe('MATCH (u:User) RETURN u{.*} AS _');
  });

  test('with WhereQuery', () => {
    const matchNodeQuery = new MatchNodeQuery(
      new NodeLiteral('u', new NodeLabel('User'), null),
      new WhereQuery(null, 'u.id = $id'),
      new OrderByQueries([])
    );

    expect(matchNodeQuery.get('_')).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _'
    );
  });
});
