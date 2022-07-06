import { EntityParameter } from '../../parameter/EntityParameter';

describe(`${EntityParameter.name}`, () => {
  test('parameter type', () => {
    new EntityParameter({
      a: 'string',
      b: 1,
      c: true,
      d: ['string'],
      e: [1.2],
      f: [false],
    });

    expect(true).toBe(true);
  });
});
