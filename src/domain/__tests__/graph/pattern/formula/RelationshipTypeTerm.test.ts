import { RelationshipTypeTerm } from '../../../../graph/pattern/formula/RelationshipTypeTerm';
import { PatternIndex } from '../../../../graph/pattern/formula/PatternIndex';

describe(`${RelationshipTypeTerm.name}`, () => {
  test.each([[new PatternIndex(0)], [new PatternIndex(1)]])(
    'throw error with wrong index',
    (index: PatternIndex) => {
      expect(() => {
        new RelationshipTypeTerm('node', index);
      }).toThrowError();
    }
  );

  test.each([
    [':rel', true],
    [':rel@name', true],
    ['rel', false],
    ['<-', false],
    ['-', false],
    ['->', false],
  ])('throw error with not label', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new RelationshipTypeTerm(value, new PatternIndex(2));
    });
    isValid ? exp.not.toThrowError() : exp.toThrowError();
  });

  test.each([
    [':rel', 'rel'],
    [':rel@modifier', 'rel@modifier'],
  ])('getValueWithoutLabelPrefix', (value: string, expected: string) => {
    expect(
      new RelationshipTypeTerm(
        value,
        new PatternIndex(2)
      ).getValueWithoutLabelPrefix()
    ).toBe(expected);
  });
});
