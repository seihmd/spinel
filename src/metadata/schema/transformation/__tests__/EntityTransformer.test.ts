import { EntityTransformer } from '../EntityTransformer';
import { TransformationRules } from '../property/TransformationRules';
import { Expose } from 'class-transformer';
import { TransformationRule } from '../property/TransformationRule';
import { EntityPropertyMetadata } from '../../entity/EntityPropertyMetadata';
import { instance, mock, when } from 'ts-mockito';
import { IntegerTransformer } from '../property/IntegerTransformer';
import { DateTime, Integer } from 'neo4j-driver';
import { DateTimeTransformer } from '../property/DateTimeTransformer';

function stubEntityPropertyMetadata(key: string): EntityPropertyMetadata {
  const entityPropertyMetadata = mock(EntityPropertyMetadata);
  when(entityPropertyMetadata.getKey()).thenReturn(key);

  return instance(entityPropertyMetadata);
}

describe(`${EntityTransformer.name}`, () => {
  class A {
    @Expose() a = 'A';
    @Expose() b = 3;
    @Expose() c = new Date('2020-01-01 00:00:00');
  }

  const transformationRules = new TransformationRules([
    new TransformationRule(
      stubEntityPropertyMetadata('b'),
      new IntegerTransformer()
    ),
    new TransformationRule(
      stubEntityPropertyMetadata('c'),
      new DateTimeTransformer()
    ),
  ]);
  const entityTransformer = new EntityTransformer(transformationRules);

  test('toPlain', () => {
    expect(entityTransformer.parameterize(new A())).toStrictEqual({
      a: 'A',
      b: Integer.fromNumber(3),
      c: DateTime.fromStandardDate(new Date('2020-01-01 00:00:00')),
    });
  });

  test('toInstance', () => {
    expect(
      entityTransformer.unparameterize(
        {
          a: 'A',
          b: Integer.fromNumber(3),
          c: DateTime.fromStandardDate(new Date('2020-01-01 00:00:00')),
        },
        A
      )
    ).toStrictEqual(new A());
  });
});
