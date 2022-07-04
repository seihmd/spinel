import { PatternIndex } from '../../../../graph/pattern/formula/PatternIndex';
import { RelationshipKeyTerm } from '../../../../graph/pattern/formula/RelationshipKeyTerm';

describe(`${RelationshipKeyTerm.name}`, () => {
  it.each([[new PatternIndex(0)], [new PatternIndex(1)]])(
    'throw error with wrong index',
    (index: PatternIndex) => {
      expect(() => {
        new RelationshipKeyTerm('rel', index);
      }).toThrowError();
    }
  );

  it.each([
    ['rel', true],
    [':rel', false],
    ['<-', false],
    ['-', false],
    ['->', false],
  ])('throw error with direction value', (value: string, isValid: boolean) => {
    const exp = expect(() => {
      new RelationshipKeyTerm(value, new PatternIndex(2));
    });
    isValid ? exp.not.toThrowError() : exp.toThrowError();
  });
});
