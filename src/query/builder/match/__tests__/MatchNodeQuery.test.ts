import { MatchNodeQuery } from '../MatchNodeQuery';
import { NodeLiteral } from '../../../literal/NodeLiteral';
import { NodeLabel } from '../../../../domain/node/NodeLabel';
import { WhereQuery } from '../../where/WhereQuery';
import { OrderByQueries } from '../../orderBy/OrderByQueries';

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
