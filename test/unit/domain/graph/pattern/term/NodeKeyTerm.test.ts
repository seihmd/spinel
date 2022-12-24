import { NodeKeyTerm } from 'domain/graph/pattern/term/NodeKeyTerm';

describe(`${NodeKeyTerm.name}`, () => {
  it.each([
    ['node', true],
    ['node_name', true],
    ['node.key', false],
    ['', false],
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
