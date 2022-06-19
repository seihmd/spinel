import 'reflect-metadata';
import { ReflectedType } from '../../../reflection/ReflectedType';
import { PrimaryType } from '../../../schema/entity/PrimaryType';

describe('PrimaryType', () => {
  test('new instance with ReflectedType', () => {
    function Assert(expectError: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        const exp = expect(() => {
          PrimaryType.new(reflectedType);
        });
        if (expectError) {
          exp.toThrowError();
        } else {
          exp.not.toThrowError();
        }
      };
    }

    class C {
      @Assert(false)
      p1?: string;

      @Assert(false)
      p2?: number;

      @Assert(true)
      p3?: boolean;

      @Assert(true)
      p4?: string[];
    }
  });

  test('getKey, getType', () => {
    const primaryType = new PrimaryType('key', String);
    expect(primaryType.getType()).toBe(String);
    expect(primaryType.getKey()).toBe('key');
  });
});
