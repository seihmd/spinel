import { ConstraintData } from '../ConstraintData';
import { NodePropertyExistenceConstraint } from '../NodePropertyExistenceConstraint';
import {
  nodeKeyConstraintData,
  nodePropertyExistenceConstraintData,
  relationshipPropertyExistenceConstraintData,
  uniquenessConstraintData,
} from './ConstraintDataFixture';

describe(`${NodePropertyExistenceConstraint.name}`, () => {
  test.each([
    [nodeKeyConstraintData, false],
    [nodePropertyExistenceConstraintData, true],
    [relationshipPropertyExistenceConstraintData, false],
    [uniquenessConstraintData, false],
  ])('withData', (constraintData: ConstraintData, isValid: boolean) => {
    const exp = expect(() => {
      NodePropertyExistenceConstraint.withData(constraintData);
    });
    if (isValid) {
      exp.not.toThrowError();
    } else {
      exp.toThrowError();
    }
  });
});
