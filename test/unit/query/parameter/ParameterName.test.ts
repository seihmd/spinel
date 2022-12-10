import { ParameterName } from 'query/parameter/ParameterName';

describe(`${ParameterName.name}`, () => {
  test.each([['p'], ['p.q']])('get returns original value', (value: string) => {
    const parameterName = new ParameterName(value);
    expect(parameterName.get()).toBe(value);
  });

  test.each([
    ['p', ['p']],
    ['p.q', ['p', 'q']],
  ])('getSplit returns split value', (value: string, expected: string[]) => {
    const parameterName = new ParameterName(value);
    expect(parameterName.getSplit()).toStrictEqual(expected);
  });

  test.each([['.p'], ['p.'], ['.p.q'], ['p.q.'], ['.'], ['..'], ['']])(
    'invalid value',
    (value: string) => {
      expect(() => {
        new ParameterName(value);
      }).toThrowError();
    }
  );
});
