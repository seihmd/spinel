import { GraphParameterKey } from '../../parameter/GraphParameterKey';
import { EntityParameterType } from '../../parameter/ParameterType';
import { GraphParameterEntry } from '../../parameter/GraphParameterEntry';

describe(`${GraphParameterEntry.name}`, () => {
  test.each([
    ['a', { id: '1' }, { a: { id: '1' } }],
    ['a.b', { id: '1' }, { a: { b: { id: '1' } } }],
    ['a.b.c', { id: '1' }, { a: { b: { c: { id: '1' } } } }],
  ])('asPlain', (key: string, value: EntityParameterType, expected: Object) => {
    const e = new GraphParameterEntry(new GraphParameterKey(key), value);
    expect(e.asPlain()).toStrictEqual(expected);
  });
});
