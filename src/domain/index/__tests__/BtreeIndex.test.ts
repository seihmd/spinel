import { BtreeIndex } from '../BtreeIndex';
import { NodeLabel } from '../../node/NodeLabel';
import { RelationshipType } from '../../relationship/RelationshipType';

describe(`${BtreeIndex.name}`, () => {
  test.each([
    [
      new BtreeIndex(new NodeLabel('TestLabel'), ['p'], null, null),
      'SPNL_i_n_bt_TestLabel_p',
    ],
    [
      new BtreeIndex(new NodeLabel('TestLabel'), ['p1', 'p2'], null, null),
      'SPNL_i_n_bt_TestLabel_p1_p2',
    ],
    [
      new BtreeIndex(new RelationshipType('TestType'), ['p'], null, null),
      'SPNL_i_r_bt_TestType_p',
    ],
    [
      new BtreeIndex(
        new RelationshipType('TestType'),
        ['p1', 'p2'],
        null,
        null
      ),
      'SPNL_i_r_bt_TestType_p1_p2',
    ],
  ])('getName', (index: BtreeIndex, expected: string) => {
    expect(index.getName()).toBe(expected);
  });
});
