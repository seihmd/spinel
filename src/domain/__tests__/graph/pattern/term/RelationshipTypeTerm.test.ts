import { RelationshipTypeTerm } from '../../../../graph/pattern/term/RelationshipTypeTerm';

describe(`${RelationshipTypeTerm.name}`, () => {
  test.each([
    [':rel', true],
    [':rel@name', true],
    ['rel', false],
    ['<-', false],
    ['-', false],
    ['->', false],
    ['*', false],
  ])('throw error with not label', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new RelationshipTypeTerm(value);
    });
    isValid ? exp.not.toThrowError() : exp.toThrowError();
  });

  test.each([
    [':rel', 'rel'],
    [':rel@modifier', 'rel@modifier'],
  ])('getValueWithoutLabelPrefix', (value: string, expected: string) => {
    expect(new RelationshipTypeTerm(value).getValueWithoutLabelPrefix()).toBe(
      expected
    );
  });

  test.each([
    [':rel', null],
    [':rel@modifier', 'modifier'],
  ])('getKey', (value: string, expected: string | null) => {
    expect(new RelationshipTypeTerm(value).getKey()).toBe(expected);
  });
});
