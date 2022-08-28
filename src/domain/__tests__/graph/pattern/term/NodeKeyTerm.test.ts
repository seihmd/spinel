import { NodeKeyTerm } from '../../../../graph/pattern/term/NodeKeyTerm';

describe(`${NodeKeyTerm.name}`, () => {
  it.each([
    ['node', true],
    [':node', false],
    ['<-', false],
    ['-', false],
    ['->', false],
    ['*', false],
  ])('throw error with invalid value', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new NodeKeyTerm(value);
    });
    isValid ? exp.not.toThrowError() : exp.toThrowError();
  });
});
