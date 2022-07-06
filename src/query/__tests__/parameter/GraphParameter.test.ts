import { EntityParameter } from '../../parameter/EntityParameter';
import {
  EntityParameterType,
  GraphParameterType,
} from '../../parameter/ParameterType';
import { GraphParameter } from '../../parameter/GraphParameter';

describe(`${GraphParameter.name}`, () => {
  test.each([
    [{}, {}],
    [{ a: { id: 1 } }, { a: { id: 1 } }],
    [
      { a: { id: 1 }, 'b.a': { id: 2 } },
      { a: { id: 1 }, b: { a: { id: 2 } } },
    ],
    [
      { a: { id: 1 }, 'b.a': { id: 2 }, 'b.c': { id: 3 } },
      { a: { id: 1 }, b: { a: { id: 2 }, c: { id: 3 } } },
    ],
  ])('asPlain', (value: GraphParameterType, expected: Object) => {
    expect(new GraphParameter('', value).asPlain()).toStrictEqual(expected);
  });

  test.each([
    [{}, {}],
    [{ a: { id: 1 } }, { a: { id: 1 } }],
    [
      { a: { id: 1 }, 'b.a': { id: 2 } },
      { a: { id: 1 }, b: { a: { id: 2 } } },
    ],
  ])('asPlain', (value: GraphParameterType, expected: Object) => {
    expect(new GraphParameter('', value).asPlain()).toStrictEqual(expected);
  });

  test.each([
    [{}, 'a', {}],
    [{ a: { id: 1 } }, 'a', {}],
    [{ a: { id: 1 }, 'b.a': { id: 2 } }, 'b', { 'b.a': { id: 2 } }],
    [
      { a: { id: 1 }, 'b.a': { id: 2 }, 'b.c': { id: 3 } },
      'b',
      { 'b.a': { id: 2 }, 'b.c': { id: 3 } },
    ],
  ])(
    'of',
    (value: GraphParameterType, root: string, expected: GraphParameterType) => {
      expect(new GraphParameter('', value).of(root)).toStrictEqual(
        new GraphParameter(root, expected)
      );
    }
  );

  test.each([
    [{}, '', 'a', {}],
    [{ a: { id: 1 } }, '', 'a', { id: 1 }],
    [{ a: { id: 1 }, 'b.a': { id: 2 } }, 'b', 'a', { id: 2 }],
    [{ a: { id: 1 }, 'b.a': { id: 2 } }, 'b', 'c', {}],
    [{ 'b.c': { id: 2 }, c: { id: 1 } }, '', 'c', { id: 1 }],
  ])(
    'get',
    (
      value: GraphParameterType,
      root: string,
      key: string,
      expected: EntityParameterType
    ) => {
      expect(new GraphParameter(root, value).get(key)).toStrictEqual(
        new EntityParameter(expected)
      );
    }
  );
});
