import {
  nodeKeyConstraintData,
  nodePropertyExistenceConstraintData,
  relationshipPropertyExistenceConstraintData,
  uniquenessConstraintData,
} from './ConstraintDataFixture';
import { ConstraintData } from '../ConstraintData';
import { RelationshipPropertyExistenceConstraint } from '../RelationshipPropertyExistenceConstraint';

describe(`${RelationshipPropertyExistenceConstraint.name}`, () => {
  test.each([
    [nodeKeyConstraintData, false],
    [nodePropertyExistenceConstraintData, false],
    [relationshipPropertyExistenceConstraintData, true],
    [uniquenessConstraintData, false],
  ])('withData', (constraintData: ConstraintData, isValid: boolean) => {
    const exp = expect(() => {
      RelationshipPropertyExistenceConstraint.withData(constraintData);
    });
    if (isValid) {
      exp.not.toThrowError();
    } else {
      exp.toThrowError();
    }
  });
});
