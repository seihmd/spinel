import { NodeLabelTerm } from 'domain/graph/pattern/term/NodeLabelTerm';

describe('NodeLabelTerm', () => {
  test.each([
    ['(:node)', null, 'node'],
    ['(var:node)', 'var', 'node'],
    ['(var)', 'var', null],
    ['()', null, null],
  ])(
    'valid value',
    (value: string, alias: string | null, label: string | null) => {
      const nodeLabelTerm = new NodeLabelTerm(value);
      expect(nodeLabelTerm.getAlias()).toBe(alias);
      expect(nodeLabelTerm.getLabel()).toBe(label);
    }
  );

  test.each([[''], ['(:)'], ['({})'], ['var']])(
    'invalid value will throw error',
    (value: string) => {
      const exp = expect(() => {
        new NodeLabelTerm(value);
      }).toThrowError();
    }
  );
});
