import { ReflectedType } from 'metadata/reflection/ReflectedType';
import { PropertyType } from 'metadata/schema/entity/PropertyType';
import 'reflect-metadata';

describe('PropertyType', () => {
  test('new instance with ReflectedType', () => {
    function Assert(
      expectedPropertyKey: string,
      expectedType: unknown
    ): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        const primaryType = PropertyType.new(reflectedType);
        expect(primaryType.getKey()).toBe(expectedPropertyKey);
        expect(primaryType.getType()).toBe(expectedType);
      };
    }

    class C {
      @Assert('p1', String)
      p1?: string;

      @Assert('p2', Number)
      p2?: number;

      @Assert('p3', Date)
      p3?: Date;

      @Assert('p4', Array)
      p4?: string[];
    }
  });

  test('getKey, getType', () => {
    const propertyType = new PropertyType('key', String);
    expect(propertyType.getKey()).toBe('key');
    expect(propertyType.getType()).toBe(String);
  });
});
