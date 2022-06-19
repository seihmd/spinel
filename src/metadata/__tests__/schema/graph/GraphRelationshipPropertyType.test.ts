import 'reflect-metadata';
import { GraphRelationshipPropertyType } from '../../../schema/graph/GraphRelationshipPropertyType';
import { ReflectedType } from '../../../reflection/ReflectedType';

describe(`${GraphRelationshipPropertyType.name}`, () => {
  test('new instance with no type', () => {
    function Assert(isValid: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        const exp = expect(() => {
          GraphRelationshipPropertyType.new(reflectedType);
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

  test('new instance with type', () => {
    function Assert(isValid: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const reflectedType = new ReflectedType(target, propertyKey);
        const exp = expect(() => {
          GraphRelationshipPropertyType.new(reflectedType, A);
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

    const graphRelationshipPropertyType = new GraphRelationshipPropertyType(
      'key',
      A
    );

    expect(graphRelationshipPropertyType.getKey()).toBe('key');
    expect(graphRelationshipPropertyType.getType()).toBe(A);
  });
});
