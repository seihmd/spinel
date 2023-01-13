import { NodeLabel } from 'domain/node/NodeLabel';
import { NodeLiteral } from 'query/literal/NodeLiteral';
import { PositiveInt } from '../../../../../src/domain/type/PositiveInt';
import { FindNodeStatement } from '../../../../../src/query/builder/find/FindNodeStatement';

describe(`FindNodeStatement`, () => {
  test('get', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      null,
      [],
      null,
      null
    );

    expect(findNodeStatement.get()).toBe('MATCH (u:User) RETURN u{.*} AS _');
  });

  test('with WhereQuery', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      'u.id = $id',
      [],
      null,
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
      new PositiveInt(3),
      null
    );

    expect(findNodeStatement.get()).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _ LIMIT 3'
    );
  });

  test('with Skip', () => {
    const findNodeStatement = new FindNodeStatement(
      new NodeLiteral('u', new NodeLabel('User'), null),
      'u.id = $id',
      [],
      null,
      new PositiveInt(3)
    );

    expect(findNodeStatement.get()).toBe(
      'MATCH (u:User) WHERE u.id = $id RETURN u{.*} AS _ SKIP 3'
    );
  });
});
