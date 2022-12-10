import { ReflectedType } from 'metadata/reflection/ReflectedType';
import { GraphNodePropertyType } from 'metadata/schema/graph/GraphNodePropertyType';
import 'reflect-metadata';

describe(`${GraphNodePropertyType.name}`, () => {
  test('new instance with no type', () => {
    function Assert(isValid: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        const exp = expect(() => {
          GraphNodePropertyType.new(reflectedType);
        });
        if (isValid) {
          exp.not.toThrowError();
        } else {
          exp.toThrowError();
        }
      };
    }

    class A {}

    class C {
      @Assert(true)
      p1?: A;

      @Assert(false)
      p2?: A | null;

      @Assert(false)
      p3?: string;

      @Assert(false)
      p4?: A[];
    }
  });

  test('when class type specified', () => {
    function Assert(isValid: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        const exp = expect(() => {
          GraphNodePropertyType.new(reflectedType, A);
        });
        if (isValid) {
          exp.not.toThrowError();
        } else {
          exp.toThrowError();
        }
      };
    }

    class A {}

    class C {
      @Assert(true)
      p1?: A;

      @Assert(true)
      p2?: A | null;

      @Assert(true)
      p3?: string | null; // technical limitation

      @Assert(false)
      p4?: string;

      @Assert(false)
      p5?: A[];
    }
  });

  test('getKey, getType', () => {
    class A {}

    const graphNodePropertyType = new GraphNodePropertyType('key', A);
    expect(graphNodePropertyType.getKey()).toBe('key');
    expect(graphNodePropertyType.getType()).toBe(A);
  });
});
