import { ReflectedType } from 'metadata/reflection/ReflectedType';
import 'reflect-metadata';

describe('ReflectedType', () => {
  test('isConstructor', () => {
    function Assert(expected: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        expect(reflectedType.isConstructor()).toBe(expected);
      };
    }

    class A {}

    class C {
      @Assert(true)
      p1?: A;

      @Assert(false)
      p2?: A[];

      @Assert(false)
      p3?: string;
    }
  });

  test('isArray', () => {
    function Assert(expected: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        expect(reflectedType.isArray()).toBe(expected);
      };
    }

    class C {
      @Assert(true)
      p2: string[] = [];

      @Assert(true)
      p3?: string[];

      @Assert(false)
      p1 = '';

      @Assert(false)
      p4: string[] | null = null;
    }
  });

  test('isObject', () => {
    function Assert(expected: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        expect(reflectedType.isObject()).toBe(expected);
      };
    }

    class C {
      @Assert(true)
      p: string | null = null;

      @Assert(true)
      p2?: Object;

      @Assert(true)
      p3?: Record<any, any>;

      @Assert(false)
      p4?: string;

      @Assert(false)
      p5?: string = '';
    }
  });
});
