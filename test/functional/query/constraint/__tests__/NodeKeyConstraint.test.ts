import { NodeKeyConstraint } from '../NodeKeyConstraint';
import { ConstraintData } from '../ConstraintData';
import {
  nodeKeyConstraintData,
  nodePropertyExistenceConstraintData,
  relationshipPropertyExistenceConstraintData,
  uniquenessConstraintData,
} from './ConstraintDataFixture';

describe(`${NodeKeyConstraint.name}`, () => {
  test.each([
    [nodeKeyConstraintData, true],
    [nodePropertyExistenceConstraintData, false],
    [relationshipPropertyExistenceConstraintData, false],
    [uniquenessConstraintData, false],
  ])('withData', (constraintData: ConstraintData, isValid: boolean) => {
    const exp = expect(() => {
      NodeKeyConstraint.withData(constraintData);
    });
    if (isValid) {
      exp.not.toThrowError();
    } else {
      exp.toThrowError();
    }
  });
});
