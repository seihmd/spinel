import { EntityParameter } from '../EntityParameter';
import { GraphParameter } from '../GraphParameter';

describe(`${GraphParameter.name}`, () => {
  test('withPlain', () => {
    const graphParameter = GraphParameter.withPlain({
      p: { q: 'v' },
    });

    expect(graphParameter).toStrictEqual(
      new GraphParameter({
        p: EntityParameter.withPlain({ q: 'v' }, 'p'),
      })
    );
  });

  test('toPlain', () => {
    const graphParameter = GraphParameter.withPlain({
      p: { q: 'v' },
    });

    expect(graphParameter.toPlain()).toStrictEqual({
      p: { q: 'v' },
    });
  });

  test('toParameter', () => {
    const graphParameter = GraphParameter.withPlain({
      p: { q: 'v' },
    });

    expect(graphParameter.toParameter()).toStrictEqual({
      p: { q: '$p.q' },
    });
  });
});
