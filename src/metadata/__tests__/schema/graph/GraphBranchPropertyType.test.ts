import 'reflect-metadata';
import { GraphRelationshipPropertyType } from '../../../schema/graph/GraphRelationshipPropertyType';
import { GraphBranchPropertyType } from '../../../schema/graph/GraphBranchPropertyType';
import { ReflectedType } from '../../../reflection/ReflectedType';

class A {}

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
      @Assert(false) p4?: A;
    }
  });

  test('getKey, getType', () => {
    const propertyType = new GraphRelationshipPropertyType('key', A);
    expect(propertyType.getKey()).toBe('key');
    expect(propertyType.getType()).toBe(A);
  });
});
