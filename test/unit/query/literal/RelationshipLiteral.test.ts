import { RelationshipType } from 'domain/relationship/RelationshipType';
import { ParameterLiteral } from 'query/literal/ParameterLiteral';
import { RelationshipLiteral } from 'query/literal/RelationshipLiteral';
import { instance, mock, when } from 'ts-mockito';

describe(`${RelationshipLiteral.name}`, () => {
  const parameterLiteralStub = mock(ParameterLiteral);
  when(parameterLiteralStub.get()).thenReturn('{id:$a.id}');
  const parameterLiteral = instance(parameterLiteralStub);

  test.each([
    ['r', new RelationshipType('HAS'), parameterLiteral, '[r:HAS{id:$a.id}]'],
    ['r', null, parameterLiteral, '[r{id:$a.id}]'],
    ['r', new RelationshipType('HAS'), null, '[r:HAS]'],
    ['r', null, null, '[r]'],
  ])(
    'get',
    (
      variableName: string,
      relationshipType: RelationshipType | null,
      parameterLiteral: ParameterLiteral | null,
      expected: string
    ) => {
      const relationshipLiteral = new RelationshipLiteral(
        variableName,
        relationshipType,
        parameterLiteral
      );

      expect(relationshipLiteral.get()).toBe(expected);
    }
  );
});
