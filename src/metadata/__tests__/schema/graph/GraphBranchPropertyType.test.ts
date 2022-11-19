import 'reflect-metadata';
import { GraphRelationshipPropertyType } from '../../../schema/graph/GraphRelationshipPropertyType';
import { GraphBranchPropertyType } from '../../../schema/graph/GraphBranchPropertyType';
import { ReflectedType } from '../../../reflection/ReflectedType';

class A {}

class ExtendedSet extends Set {}

describe(`${GraphBranchPropertyType.name}`, () => {
  test('valid definition', () => {
    function Assert(isValid: boolean): PropertyDecorator {
      return function (target: Object, propertyKey: string | symbol) {
        const exp = expect(() => {
          GraphBranchPropertyType.new(
            new ReflectedType(target, propertyKey),
            C
          );
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
      @Assert(true) p1?: A[];
      @Assert(true) p2?: A[] | null;
      @Assert(true) p3?: A | null; // technical limitation
      @Assert(true) p4?: Set<A>; // technical limitation
      @Assert(true) p5?: ExtendedSet;
      @Assert(false) p6?: A;
    }
  });

  test('getKey, getType', () => {
    const propertyType = new GraphRelationshipPropertyType('key', A);
    expect(propertyType.getKey()).toBe('key');
    expect(propertyType.getType()).toBe(A);
  });
});
