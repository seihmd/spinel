import { Parameter } from '../Parameter';
import { EntityParameter } from '../EntityParameter';
import { TransformationRules } from '../../../metadata/schema/transformation/TransformationRules';

describe(`${EntityParameter.name}`, () => {
  test('withPlain', () => {
    const entityParameter = EntityParameter.withPlain(
      { p: 'value' },
      null,
      new TransformationRules([])
    );

    expect(entityParameter).toStrictEqual(
      new EntityParameter(
        { p: Parameter.new('p', 'value') },
        new TransformationRules([])
      )
    );
  });

  test('withPlain with graphKey', () => {
    const entityParameter = EntityParameter.withPlain(
      { p: 'value' },
      'q',
      new TransformationRules([])
    );

    expect(entityParameter).toStrictEqual(
      new EntityParameter(
        { p: Parameter.new('q.p', 'value') },
        new TransformationRules([])
      )
    );
  });

  test('parameterize', () => {
    const entityParameter = new EntityParameter(
      {
        p: Parameter.new('p', 'pValue'),
        q: Parameter.new('q', 'qValue'),
      },
      new TransformationRules([])
    );

    expect(entityParameter.parameterize()).toStrictEqual({
      p: 'pValue',
      q: 'qValue',
    });
  });

  test('toParameter', () => {
    const entityParameter = new EntityParameter(
      {
        p: Parameter.new('p', 'pValue'),
        q: Parameter.new('q', 'qValue'),
      },
      new TransformationRules([])
    );

    expect(entityParameter.toParameter()).toStrictEqual({ p: '$p', q: '$q' });
  });
});
