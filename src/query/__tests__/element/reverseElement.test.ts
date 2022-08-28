import { reverseElement } from '../../element/reverseElement';
import { NodeElement } from '../../element/NodeElement';
import { instance, mock, when } from 'ts-mockito';
import { Direction } from '../../../domain/graph/Direction';
import { DirectionElement } from '../../element/DirectionElement';
import { DirectionTerm } from '../../../domain/graph/pattern/term/DirectionTerm';

function nodeElement(graphKey: string): NodeElement {
  const stub = mock(NodeElement);
  when(stub.getGraphKey()).thenReturn(graphKey);
  return instance(stub);
}

function directionElement(direction: Direction): DirectionElement {
  return new DirectionElement(new DirectionTerm(direction));
}

describe(`${reverseElement.name}`, () => {
  test('reverse elements', () => {
    const node1 = nodeElement('node1');
    const direction = directionElement('<-');
    const node2 = nodeElement('node2');

    expect(reverseElement([node1, direction, node2])).toMatchObject([
      node2,
      directionElement('->'),
      node1,
    ]);
  });
});
