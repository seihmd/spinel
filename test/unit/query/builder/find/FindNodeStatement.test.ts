import { NodeLabel } from 'domain/node/NodeLabel';
import { NodeLiteral } from 'query/literal/NodeLiteral';
import { PositiveInt } from '../../../../../src/domain/type/PositiveInt';
import { FindNodeStatement } from '../../../../../src/query/builder/find/FindNodeStatement';
import { LimitClause } from '../../../../../src/query/clause/LimitClause';

describe(`FindNodeStatement`, () => {
  test('get', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      null,
      [],
      null
    );

    expect(findNodeStatement.get()).toBe('MATCH (u:User) RETURN u{.*} AS _');
  });

  test('with WhereQuery', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      'u.id = $id',
      [],
      null
    );

    expect(findNodeStatement.get()).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _'
    );
  });

  test('with Limit', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      'u.id = $id',
      [],
      new LimitClause(new PositiveInt(3))
    );

    expect(findNodeStatement.get()).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _ LIMIT 3'
    );
  });
});
