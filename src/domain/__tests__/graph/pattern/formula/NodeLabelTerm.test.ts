import { NodeLabelTerm } from '../../../../graph/pattern/formula/NodeLabelTerm';
import { PatternIndex } from '../../../../graph/pattern/formula/PatternIndex';

describe('NodeLabelTerm', () => {
  test.each([[new PatternIndex(1)], [new PatternIndex(2)]])(
    'throw error with wrong index',
    (index: PatternIndex) => {
      expect(() => {
        new NodeLabelTerm('node', index);
      }).toThrowError();
    }
  );

  test.each([
    [':node', true],
    [':node@name', true],
    ['node', false],
    ['<-', false],
    ['-', false],
    ['->', false],
  ])('throw error with not label', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new NodeLabelTerm(value, new PatternIndex(0));
    });
    isValid ? exp.not.toThrowError() : exp.toThrowError();
  });

  test.each([
    [':node', 'node'],
    [':node@modifier', 'node@modifier'],
  ])('getValueWithoutLabelPrefix', (value: string, expected: string) => {
    expect(
      new NodeLabelTerm(value, new PatternIndex(0)).getValueWithoutLabelPrefix()
    ).toBe(expected);
  });

  test.each([
    [':node', 'node'],
    [':node@modifier', 'node'],
  ])('getLabel', (value: string, expected: string) => {
    expect(new NodeLabelTerm(value, new PatternIndex(0)).getLabel()).toBe(
      expected
    );
  });
});
