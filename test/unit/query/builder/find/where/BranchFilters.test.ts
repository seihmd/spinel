import { BranchFilter } from '../../../../../../src/query/builder/find/where/BranchFilter';
import { BranchFilters } from '../../../../../../src/query/builder/find/where/BranchFilters';
import { BranchIndex } from '../../../../../../src/query/meterial/BranchIndex';
import { BranchIndexes } from '../../../../../../src/query/meterial/BranchIndexes';

describe('BranchFilters', () => {
  const testCases = [
    [['a'], 'a', 'a'],
    [['a'], 'b', null],
    [['a', 'b'], 'a', 'a'],
    [['a', 'b'], 'b', 'b'],
    [['a', 'b'], 'c', null],
  ] as [string[], string, string | null][];

  test.each(testCases)(
    'of',
    (branchNames: string[], of: string, expected: string | null) => {
      expect(
        new BranchFilters(branchNames.map((b) => new BranchFilter(b, '_'))).of(
          new BranchIndexes([new BranchIndex(0, of)])
        )
      ).toStrictEqual(expected ? new BranchFilter(expected, '_') : null);
    }
  );
});
