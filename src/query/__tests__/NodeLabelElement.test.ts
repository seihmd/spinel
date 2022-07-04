import { NodeLabelTerm } from '../../domain/graph/pattern/formula/NodeLabelTerm';
import { PatternIndex } from '../../domain/graph/pattern/formula/PatternIndex';
import { NodeLabelElement } from '../element/NodeLabelElement';

describe('NodeLabelElement', () => {
  test.each([
    [':Node', null],
    [':Node@key', 'key'],
  ])('getGraphParameterKey', (value: string, key: string | null) => {
    const nodeLabelTerm = new NodeLabelTerm(value, new PatternIndex(0));

    const nodeLabelElement = new NodeLabelElement(nodeLabelTerm);
    expect(nodeLabelElement.getGraphParameterKey()).toBe(key);
  });

  test.each([
    [':Node', 'Node'],
    [':Node@key', 'Node'],
  ])('getLabel', (value: string, label: string | null) => {
    const nodeLabelTerm = new NodeLabelTerm(value, new PatternIndex(0));

    const nodeLabelElement = new NodeLabelElement(nodeLabelTerm);
    expect(nodeLabelElement.getLabel().toString()).toBe(label);
  });
});
