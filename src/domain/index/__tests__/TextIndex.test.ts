import { NodeLabel } from '../../node/NodeLabel';
import { RelationshipType } from '../../relationship/RelationshipType';
import { TextIndex } from '../TextIndex';

describe(`${TextIndex.name}`, () => {
  test.each([
    [
      new TextIndex(new NodeLabel('TestLabel'), ['p'], null, null),
      'SPNL_i_n_t_TestLabel_p',
    ],
    [
      new TextIndex(new NodeLabel('TestLabel'), ['p1', 'p2'], null, null),
      'SPNL_i_n_t_TestLabel_p1_p2',
    ],
    [
      new TextIndex(new RelationshipType('TestType'), ['p'], null, null),
      'SPNL_i_r_t_TestType_p',
    ],
    [
      new TextIndex(new RelationshipType('TestType'), ['p1', 'p2'], null, null),
      'SPNL_i_r_t_TestType_p1_p2',
    ],
  ])('getName', (index: TextIndex, expected: string) => {
    expect(index.getName()).toBe(expected);
  });
});
