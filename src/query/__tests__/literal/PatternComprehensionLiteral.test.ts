import { PatternComprehensionLiteral } from '../../literal/PatternComprehensionLiteral';
import { instance, mock, when } from 'ts-mockito';
import { PathLiteral } from '../../literal/PathLiteral';

describe(`${PatternComprehensionLiteral.name}`, () => {
  test('get', () => {
    const pathLiteralStub = mock(PathLiteral);
    when(pathLiteralStub.get()).thenReturn('(n1)-[r]->(n2)');

    const p = new PatternComprehensionLiteral(
      instance(pathLiteralStub),
      null,
      'n2'
    );
    expect(p.get()).toBe('[(n1)-[r]->(n2)|n2]');
  });
});
