import { PatternIndex } from '../../../../graph/pattern/formula/PatternIndex';
import { NodeKeyTerm } from '../../../../graph/pattern/formula/NodeKeyTerm';

describe(`${NodeKeyTerm.name}`, () => {
  it.each([[new PatternIndex(1)], [new PatternIndex(2)]])(
    'throw error with wrong index',
    (index: PatternIndex) => {
      expect(() => {
        new NodeKeyTerm('node', index);
      }).toThrowError();
    }
  );

  it.each([
    ['node', true],
    [':node', false],
    ['<-', false],
    ['-', false],
    ['->', false],
  ])('throw error with direction value', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new NodeKeyTerm(value, new PatternIndex(0));
    });
    isValid ? exp.not.toThrowError() : exp.toThrowError();
  });
});
