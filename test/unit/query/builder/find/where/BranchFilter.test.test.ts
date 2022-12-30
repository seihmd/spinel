import { BranchFilter } from '../../../../../../src/query/builder/find/where/BranchFilter';
import { BranchIndex } from '../../../../../../src/query/meterial/BranchIndex';
import { BranchIndexes } from '../../../../../../src/query/meterial/BranchIndexes';

describe('BranchFilter', () => {
  const testCases = [
    ['a', [new BranchIndex(0, 'a')], true],
    ['a', [new BranchIndex(0, 'b')], false],
    ['a.b', [new BranchIndex(0, 'a'), new BranchIndex(1, 'b')], true],
    ['a.b', [new BranchIndex(0, 'a'), new BranchIndex(1, 'c')], false],
    [
      'a.b.c',
      [
        new BranchIndex(0, 'a'),
        new BranchIndex(1, 'b'),
        new BranchIndex(2, 'c'),
      ],
      true,
    ],
    [
      'a.b.c',
      [
        new BranchIndex(0, 'a'),
        new BranchIndex(1, 'b'),
        new BranchIndex(2, 'd'),
      ],
      false,
    ],
  ] as [string, BranchIndex[], boolean][];

  test.each(testCases)(
    'matches',
    (branch: string, branchIndexes: BranchIndex[], expected: boolean) => {
      expect(
        new BranchFilter(branch, '_').matches(new BranchIndexes(branchIndexes))
      ).toBe(expected);
    }
  );
});
