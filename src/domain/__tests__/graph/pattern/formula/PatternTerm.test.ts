import { PatternTerm } from '../../../../graph/pattern/formula/PatternTerm';
import { PatternIndex } from '../../../../graph/pattern/formula/PatternIndex';

describe(`${PatternTerm.name}`, () => {
  class Sut extends PatternTerm {
    constructor(value: string, index: PatternIndex) {
      super(value, index);
    }
  }

  test.each([
    ['value', null],
    [':value', null],
    ['value@modifier', 'modifier'],
    [':value@modifier', 'modifier'],
  ])('getParameterModifier', (value: string, modifier: string | null) => {
    const sut = new Sut(value, new PatternIndex(0));
    expect(sut.getParameterModifier()).toBe(modifier);
  });

  test.each([
    ['value', 'value'],
    [':value', 'value'],
    ['value@modifier', 'value'],
    [':value@modifier', 'value'],
  ])('getValueWithoutModifier', (value: string, modifier: string | null) => {
    const sut = new Sut(value, new PatternIndex(0));
    expect(sut.getValueWithoutModifier()).toBe(modifier);
  });
});
