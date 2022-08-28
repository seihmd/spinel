import { DirectionTerm } from '../../../../graph/pattern/term/DirectionTerm';

describe(`${DirectionTerm.name}`, () => {
  it('throw error with not direction value', () => {
    expect(() => {
      new DirectionTerm('node');
    }).toThrowError();
  });
});
