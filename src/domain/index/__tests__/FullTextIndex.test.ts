import { NodeLabel } from '../../node/NodeLabel';
import { RelationshipType } from '../../relationship/RelationshipType';
import { FullTextIndex } from '../FullTextIndex';

describe(`${FullTextIndex.name}`, () => {
  test.each([
    [
      new FullTextIndex(new NodeLabel('TestLabel'), ['p'], null, null),
      'SPNL_i_n_ft_TestLabel_p',
    ],
    [
      new FullTextIndex(new NodeLabel('TestLabel'), ['p1', 'p2'], null, null),
      'SPNL_i_n_ft_TestLabel_p1_p2',
    ],
    [
      new FullTextIndex(new RelationshipType('TestType'), ['p'], null, null),
      'SPNL_i_r_ft_TestType_p',
    ],
    [
      new FullTextIndex(
        new RelationshipType('TestType'),
        ['p1', 'p2'],
        null,
        null
      ),
      'SPNL_i_r_ft_TestType_p1_p2',
    ],
  ])('getName', (index: FullTextIndex, expected: string) => {
    expect(index.getName()).toBe(expected);
  });
});
