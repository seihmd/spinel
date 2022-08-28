import { GraphParameter } from '../../parameter/GraphParameter';
import { ElementFixture } from './ElementFixture';
import { BranchQueryContext } from '../../builder/BranchQueryContext';

import { Path } from '../../path/Path';
import { Branch } from '../../path/Branch';
import { BranchGraphMaterial } from '../../meterial/BranchGraphMaterial';

describe(`${BranchQueryContext.name}`, () => {
  test('-R-N', () => {
    const ef = new ElementFixture();

    const branchQueryContext = new BranchQueryContext(
      new Branch(
        new BranchGraphMaterial(
          Path.new([
            ef.newNodeElement('User', 'user'),
            ef.newDirectionElement('-'),
            ef.newRelationshipElement('LIKES', 'likes'),
            ef.newDirectionElement('->'),
            ef.newNodeElement('Item', 'item'),
          ]),
          'key'
        ),
        null,
        []
      ),
      new GraphParameter('', {})
    );
    expect(branchQueryContext.getMapEntries()).toStrictEqual([
      ['key', '[(n0)-[r2:LIKES]->(n0:Item)|{likes:r2{.*},item:n0{.*}}]'],
    ]);
  });

  test('N-:R-:N-R-N', () => {
    const ef = new ElementFixture();

    const branchQueryContext = new BranchQueryContext(
      new Branch(
        new BranchGraphMaterial(
          Path.new([
            ef.newNodeElement('User', 'user'),
            ef.newDirectionElement('-'),
            ef.newRelationshipTypeElement(':LIKES'),
            ef.newDirectionElement('->'),
            ef.newNodeLabelElement(':Item'),
            ef.newDirectionElement('<-'),
            ef.newRelationshipElement('HAS_STOCK', 'hasStock'),
            ef.newDirectionElement('-'),
            ef.newNodeElement('Store', 'store'),
          ]),
          'key'
        ),
        null,
        []
      ),
      new GraphParameter('', {})
    );
    expect(branchQueryContext.getMapEntries()).toStrictEqual([
      [
        'key',
        '[(n0)-[r2:LIKES]->(n0:Item)<-[r2:HAS_STOCK]-(n0:Store)|{hasStock:r2{.*},store:n0{.*}}]',
      ],
    ]);
  });

  test('N-R-N with parameter', () => {
    const ef = new ElementFixture();

    const branchQueryContext = new BranchQueryContext(
      new Branch(
        new BranchGraphMaterial(
          Path.new([
            ef.newNodeElement('User', 'user'),
            ef.newDirectionElement('-'),
            ef.newRelationshipElement('LIKES', 'likes'),
            ef.newDirectionElement('->'),
            ef.newNodeElement('Item', 'item'),
          ]),
          'key'
        ),
        null,
        []
      ),
      new GraphParameter('', {
        user: { id: '1' },
        likes: { date: '2022-01-01' },
        item: { id: '2' },
      })
    );
    expect(branchQueryContext.getMapEntries()).toStrictEqual([
      [
        'key',
        '[(n0)-[r2:LIKES{date:$likes.date}]->(n0:Item{id:$item.id})' +
          '|{likes:r2{.*},item:n0{.*}}]',
      ],
    ]);
  });
});
