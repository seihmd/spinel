import { BtreeIndex } from 'domain/index/BtreeIndex';
import { FullTextIndex } from 'domain/index/FullTextIndex';
import { TextIndex } from 'domain/index/TextIndex';
import { NodeLabel } from 'domain/node/NodeLabel';
import { CreateIndexClause } from 'query/clause/index/CreateIndexClause';

describe(`${CreateIndexClause.name}`, () => {
  test.each([
    [
      new BtreeIndex(new NodeLabel('TestLabel'), ['p'], null, null),
      'CREATE INDEX SPNL_i_n_bt_TestLabel_p IF NOT EXISTS FOR (e:TestLabel) ON (e.p)',
    ],
    [
      new BtreeIndex(new NodeLabel('TestLabel'), ['p', 'p2'], '{option}', null),
      'CREATE INDEX SPNL_i_n_bt_TestLabel_p_p2 IF NOT EXISTS FOR (e:TestLabel) ON (e.p, e.p2) OPTIONS {option}',
    ],
  ])('create btree index clause', (index: BtreeIndex, expected: string) => {
    expect(new CreateIndexClause(index).get()).toBe(expected);
  });

  test.each([
    [
      new TextIndex(new NodeLabel('TestLabel'), ['p'], null, null),
      'CREATE text INDEX SPNL_i_n_t_TestLabel_p IF NOT EXISTS FOR (e:TestLabel) ON (e.p)',
    ],
    [
      new TextIndex(new NodeLabel('TestLabel'), ['p', 'p2'], '{option}', null),
      'CREATE text INDEX SPNL_i_n_t_TestLabel_p_p2 IF NOT EXISTS FOR (e:TestLabel) ON (e.p, e.p2) OPTIONS {option}',
    ],
  ])('create text index clause', (index: TextIndex, expected: string) => {
    expect(new CreateIndexClause(index).get()).toBe(expected);
  });

  test.each([
    [
      new FullTextIndex(new NodeLabel('TestLabel'), ['p'], null, null),
      'CREATE fulltext INDEX SPNL_i_n_ft_TestLabel_p IF NOT EXISTS FOR (e:TestLabel) ON EACH [e.p]',
    ],
    [
      new FullTextIndex(
        new NodeLabel('TestLabel'),
        ['p', 'p2'],
        '{option}',
        null
      ),
      'CREATE fulltext INDEX SPNL_i_n_ft_TestLabel_p_p2 IF NOT EXISTS FOR (e:TestLabel) ON EACH [e.p, e.p2] OPTIONS {option}',
    ],
  ])(
    'create fulltext index clause',
    (index: FullTextIndex, expected: string) => {
      expect(new CreateIndexClause(index).get()).toBe(expected);
    }
  );
});
