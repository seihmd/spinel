import { ConstraintData } from '../ConstraintData';
import { UniquenessConstraint } from '../UniquenessConstraint';
import {
  nodeKeyConstraintData,
  nodePropertyExistenceConstraintData,
  relationshipPropertyExistenceConstraintData,
  uniquenessConstraintData,
} from './ConstraintDataFixture';

describe(`${UniquenessConstraint.name}`, () => {
  test.each([
    [nodeKeyConstraintData, false],
    [nodePropertyExistenceConstraintData, false],
    [relationshipPropertyExistenceConstraintData, false],
    [uniquenessConstraintData, true],
  ])('withData', (constraintData: ConstraintData, isValid: boolean) => {
    const exp = expect(() => {
      UniquenessConstraint.withData(constraintData);
    });
    if (isValid) {
      exp.not.toThrowError();
    } else {
      exp.toThrowError();
    }
  });
});
