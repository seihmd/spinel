import { BranchQueryContext } from 'query/builder/match/BranchQueryContext';
import { GraphBranchMaterial } from 'query/meterial/branch/GraphBranchMaterial';
import { Branch } from 'query/path/Branch';
import { Path } from 'query/path/Path';
import { ElementFixture } from './ElementFixture';

describe(`${BranchQueryContext.name}`, () => {
  test('-R-N', () => {
    const ef = new ElementFixture();

    const branchQueryContext = new BranchQueryContext(
      new Branch(
        new GraphBranchMaterial(
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
      )
    );
    expect(branchQueryContext.getMapEntries()).toStrictEqual([
      ['key', '[(n0)-[r2:LIKES]->(n0:Item)|{likes:r2{.*},item:n0{.*}}]'],
    ]);
  });

  test('N-[:R]-(:N)-R-N', () => {
    const ef = new ElementFixture();

    const branchQueryContext = new BranchQueryContext(
      new Branch(
        new GraphBranchMaterial(
          Path.new([
            ef.newNodeElement('User', 'user'),
            ef.newDirectionElement('-'),
            ef.newRelationshipTypeElement('[:LIKES]'),
            ef.newDirectionElement('->'),
            ef.newNodeLabelElement('(:Item)'),
            ef.newDirectionElement('<-'),
            ef.newRelationshipElement('HAS_STOCK', 'hasStock'),
            ef.newDirectionElement('-'),
            ef.newNodeElement('Store', 'store'),
          ]),
          'key'
        ),
        null,
        []
      )
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
        new GraphBranchMaterial(
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
      )
    );
    expect(branchQueryContext.getMapEntries()).toStrictEqual([
      ['key', '[(n0)-[r2:LIKES]->(n0:Item)' + '|{likes:r2{.*},item:n0{.*}}]'],
    ]);
  });
});
