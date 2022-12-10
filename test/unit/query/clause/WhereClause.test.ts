import { WhereClause } from 'query/clause/WhereClause';
import { WhereLiteral } from 'query/literal/WhereLiteral';
import { instance, mock, when } from 'ts-mockito';

describe(`${WhereClause.name}`, () => {
  test('get', () => {
    const literalStub = mock(WhereLiteral);
    when(literalStub.get()).thenReturn('n0.id = $id');
    expect(new WhereClause(instance(literalStub)).get()).toBe(
      'WHERE n0.id = $id'
    );
  });
});
