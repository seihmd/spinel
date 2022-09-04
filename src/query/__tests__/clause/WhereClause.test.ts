import { instance, mock, when } from 'ts-mockito';
import { WhereLiteral } from '../../literal/WhereLiteral';
import { WhereClause } from '../../clause/WhereClause';

describe(`${WhereClause.name}`, () => {
  test('get', () => {
    const literalStub = mock(WhereLiteral);
    when(literalStub.get()).thenReturn('n0.id = $id');
    expect(new WhereClause(instance(literalStub)).get()).toBe(
      'WHERE n0.id = $id'
    );
  });
});
