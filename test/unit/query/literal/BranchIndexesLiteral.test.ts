import { BranchIndexesLiteral } from 'query/literal/BranchIndexesLiteral';
import { BranchIndex } from 'query/meterial/BranchIndex';
import { BranchIndexes } from 'query/meterial/BranchIndexes';

describe(`${BranchIndexesLiteral.name}`, () => {
  test.each([
    [[], ''],
    [[new BranchIndex(0, 'a')], 'b0_'],
    [[new BranchIndex(1, 'a'), new BranchIndex(2, 'a')], 'b1_b2_'],
    [[new BranchIndex(1, 'a', 0), new BranchIndex(2, 'a', 1)], 'b1_0_b2_1_'],
  ])('get', (indexes: BranchIndex[], expected: string) => {
    expect(new BranchIndexesLiteral(new BranchIndexes(indexes)).get()).toBe(
      expected
    );
  });
});
