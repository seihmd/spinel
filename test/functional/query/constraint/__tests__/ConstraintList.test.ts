import { ConstraintList } from '../ConstraintList';
import { NodeLabel } from '../../../../../src/domain/node/NodeLabel';
import { RelationshipType } from '../../../../../src/domain/relationship/RelationshipType';
import { ConstraintInterface } from '../ConstraintInterface';

const stubConstraint = (name: string): ConstraintInterface => {
  class TestConstraint implements ConstraintInterface {
    getLabelOrType(): NodeLabel | RelationshipType {
      return new NodeLabel('');
    }

    getName(): string {
      return name;
    }

    getProperties(): string[] {
      return [];
    }

    getRequire(): string {
      return '';
    }
  }

  return new TestConstraint();
};

describe(`${ConstraintList.name}`, () => {
  const constraint1 = stubConstraint('constraint1');
  const constraint2 = stubConstraint('constraint2');

  test.each([
    [[], [], [], []],
    [[constraint1], [], [constraint1], []],
    [[constraint1], [{ name: 'constraint1' }], [], []],
    [[constraint1], [{ name: 'constraint2' }], [constraint1], ['constraint2']],
    [
      [constraint1, constraint2],
      [{ name: 'constraint2' }, { name: 'constraint3' }],
      [constraint1],
      ['constraint3'],
    ],
  ])(
    'diff returns new constraints and to be dropped',
    (
      constraints: ConstraintInterface[],
      dataList: { name: string }[],
      expectedToCreate: ConstraintInterface[],
      expectedToDelete: string[]
    ) => {
      const constraintList = new ConstraintList(constraints);

      const [toCreate, toDrop] = constraintList.diff(dataList);
      expect(toCreate).toStrictEqual(expectedToCreate);
      expect(toDrop).toStrictEqual(expectedToDelete);
    }
  );
});
