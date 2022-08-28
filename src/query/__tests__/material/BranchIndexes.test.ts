import { BranchIndexes } from '../../meterial/BranchIndexes';
import { BranchIndex } from '../../meterial/BranchIndex';

describe(`${BranchIndexes.name}`, () => {
  test('append returns new instance', () => {
    const branchIndexes = new BranchIndexes([new BranchIndex(0, 'b0')]);
    const appended = branchIndexes.append(1, 'b1');
    expect(branchIndexes.getIndexes()).toStrictEqual([0]);
    expect(appended.getIndexes()).toStrictEqual([0, 1]);
  });

  test.each([
    [[new BranchIndex(0, 'b')], []],
    [
      [new BranchIndex(1, 'b1'), new BranchIndex(2, 'b2')],
      [new BranchIndex(1, 'b1')],
    ],
  ])(
    'reduce returns popped new instance',
    (indexes: BranchIndex[], expected: BranchIndex[]) => {
      const branchIndexes = new BranchIndexes(indexes);
      const reduced = branchIndexes.reduce();
      expect(branchIndexes).toStrictEqual(new BranchIndexes(indexes));
      expect(reduced).toStrictEqual(new BranchIndexes(expected));
    }
  );

  test.each([
    [[], [], true],
    [[new BranchIndex(0, 'b')], [new BranchIndex(0, 'b')], true],
    [
      [new BranchIndex(0, 'b0'), new BranchIndex(1, 'b1')],
      [new BranchIndex(0, 'b0'), new BranchIndex(1, 'b1')],
      true,
    ],
    [[], [new BranchIndex(0, 'b')], false],
    [[new BranchIndex(0, 'b')], [new BranchIndex(1, 'b')], false],
    [[new BranchIndex(0, 'b1')], [new BranchIndex(0, 'b2')], false],
    [
      [new BranchIndex(0, 'b0'), new BranchIndex(1, 'b1')],
      [new BranchIndex(0, 'b0'), new BranchIndex(2, 'b1')],
      false,
    ],
  ])('equals', (a: BranchIndex[], b: BranchIndex[], expected: boolean) => {
    expect(new BranchIndexes(a).equals(new BranchIndexes(b))).toBe(expected);
  });

  test.each([
    [[], [], false],
    [[new BranchIndex(0, 'b')], [], true],
    [
      [new BranchIndex(0, 'b1'), new BranchIndex(1, 'b2')],
      [new BranchIndex(0, 'b1')],
      true,
    ],
    [
      [new BranchIndex(0, 'b1'), new BranchIndex(1, 'b2')],
      [new BranchIndex(1, 'b1')],
      false,
    ],
    [
      [new BranchIndex(0, 'b1'), new BranchIndex(1, 'b2')],
      [new BranchIndex(0, 'b2')],
      false,
    ],
    [[], [new BranchIndex(0, 'b')], false],
  ])('equalsStem', (a: BranchIndex[], b: BranchIndex[], expected: boolean) => {
    expect(new BranchIndexes(a).equalsStem(new BranchIndexes(b))).toBe(
      expected
    );
  });
});
