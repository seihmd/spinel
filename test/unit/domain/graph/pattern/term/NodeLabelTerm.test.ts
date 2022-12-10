import { NodeLabelTerm } from 'domain/graph/pattern/term/NodeLabelTerm';

describe('NodeLabelTerm', () => {
  test.each([
    [':node', true],
    [':node@name', true],
    ['node', false],
    ['<-', false],
    ['-', false],
    ['->', false],
    ['*', false],
  ])('throw error with not label', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new NodeLabelTerm(value);
    });
    isValid ? exp.not.toThrowError() : exp.toThrowError();
  });

  test.each([
    [':node', 'node'],
    [':node@modifier', 'node@modifier'],
  ])('getValueWithoutLabelPrefix', (value: string, expected: string) => {
    expect(new NodeLabelTerm(value).getValueWithoutLabelPrefix()).toBe(
      expected
    );
  });

  test.each([
    [':node', 'node'],
    [':node@modifier', 'node'],
  ])('getLabel', (value: string, expected: string) => {
    expect(new NodeLabelTerm(value).getLabel()).toBe(expected);
  });

  test.each([
    [':node', null],
    [':node@modifier', 'modifier'],
  ])('getKey', (value: string, expected: string | null) => {
    expect(new NodeLabelTerm(value).getKey()).toBe(expected);
  });
});
