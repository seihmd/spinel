import { RelationshipKeyTerm } from 'domain/graph/pattern/term/RelationshipKeyTerm';

describe(`${RelationshipKeyTerm.name}`, () => {
  it.each([
    ['rel', true],
    [':rel', false],
    ['<-', false],
    ['-', false],
    ['->', false],
    ['*', false],
  ])('throw error with invalid value', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new RelationshipKeyTerm(value);
    });
    isValid ? exp.not.toThrowError() : exp.toThrowError();
  });
});
