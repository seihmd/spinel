import { DirectionTerm } from '../../../../graph/pattern/formula/DirectionTerm';
import { PatternIndex } from '../../../../graph/pattern/formula/PatternIndex';

describe(`${DirectionTerm.name}`, () => {
  it.each([[new PatternIndex(0)], [new PatternIndex(2)]])(
    'throw error with index of Node or Relationship',
    (index: PatternIndex) => {
      expect(() => {
        new DirectionTerm('-', index);
      }).toThrowError();
    }
  );

  it('throw error with not direction value', () => {
    expect(() => {
      new DirectionTerm('node', new PatternIndex(1));
    }).toThrowError();
  });

  it('cannot has "->" with index between Node and Relationship', () => {
    expect(() => {
      new DirectionTerm('->', new PatternIndex(1));
    }).toThrowError();
  });

  it('cannot has "<-" with index between Relationship and Node', () => {
    expect(() => {
      new DirectionTerm('<-', new PatternIndex(3));
    }).toThrowError();
  });
});
