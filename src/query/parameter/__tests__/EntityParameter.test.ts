import { Parameter } from '../Parameter';
import { EntityParameter } from '../EntityParameter';

describe(`${EntityParameter.name}`, () => {
  test('withPlain', () => {
    const entityParameter = EntityParameter.withPlain({ p: 'value' }, null);

    expect(entityParameter).toStrictEqual(
      new EntityParameter({ p: Parameter.new('p', 'value') })
    );
  });

  test('withPlain with graphKey', () => {
    const entityParameter = EntityParameter.withPlain({ p: 'value' }, 'q');

    expect(entityParameter).toStrictEqual(
      new EntityParameter({ p: Parameter.new('q.p', 'value') })
    );
  });

  test('toPlain', () => {
    const entityParameter = new EntityParameter({
      p: Parameter.new('p', 'pValue'),
      q: Parameter.new('q', 'qValue'),
    });

    expect(entityParameter.toPlain()).toStrictEqual({
      p: 'pValue',
      q: 'qValue',
    });
  });

  test('toParameter', () => {
    const entityParameter = new EntityParameter({
      p: Parameter.new('p', 'pValue'),
      q: Parameter.new('q', 'qValue'),
    });

    expect(entityParameter.toParameter()).toStrictEqual({ p: '$p', q: '$q' });
  });
});
