import { EntityTerm } from '../../../../../../src/domain/graph/pattern/term/EntityTerm';

describe(`EntityTerm`, () => {
  class Sut extends EntityTerm {
    constructor(value: string) {
      super(value);
    }

    getKey(): string | null {
      return this.value;
    }
  }

  test.each([
    ['value', null],
    [':value', null],
    ['value@modifier', 'modifier'],
    [':value@modifier', 'modifier'],
  ])('getParameterModifier', (value: string, modifier: string | null) => {
    const sut = new Sut(value);
    expect(sut.getParameterModifier()).toBe(modifier);
  });

  test.each([
    ['value', 'value'],
    [':value', 'value'],
    ['value@modifier', 'value'],
    [':value@modifier', 'value'],
  ])('getValueWithoutModifier', (value: string, modifier: string | null) => {
    const sut = new Sut(value);
    expect(sut.getValueWithoutModifier()).toBe(modifier);
  });
});
