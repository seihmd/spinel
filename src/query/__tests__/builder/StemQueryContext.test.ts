import { StemQueryContext } from '../../builder/StemQueryContext';
import { Stem } from '../../path/Stem';
import { GraphParameter } from '../../parameter/GraphParameter';
import { Path } from '../../path/Path';
import { ElementFixture } from './ElementFixture';
import { Depth } from '../../../domain/graph/branch/Depth';

describe(`${StemQueryContext.name}`, () => {
  test('N-R-N', () => {
    const ef = new ElementFixture();

    const stemQueryContext = new StemQueryContext(
      new Stem(
        Path.new([
          ef.newNodeElement('User', 'user'),
          ef.newDirectionElement('-'),
          ef.newRelationshipElement('LIKES', 'likes'),
          ef.newDirectionElement('->'),
          ef.newNodeElement('Item', 'item'),
        ]),
        null,
        []
      ),
      new GraphParameter('', {}),
      new Depth(2)
    );

    expect(stemQueryContext.getPathLiteral().get()).toBe(
      '(n0:User)-[r2:LIKES]->(n0:Item)'
    );
    expect(stemQueryContext.getMapEntries()).toStrictEqual([
      ['user', 'n0{.*}'],
      ['likes', 'r2{.*}'],
      ['item', 'n0{.*}'],
    ]);
  });

  test(':N-:R-:N', () => {
    const ef = new ElementFixture();

    const stemQueryContext = new StemQueryContext(
      new Stem(
        Path.new([
          ef.newNodeLabelElement(':User'),
          ef.newDirectionElement('-'),
          ef.newRelationshipTypeElement(':LIKES'),
          ef.newDirectionElement('->'),
          ef.newNodeLabelElement(':Item'),
        ]),
        null,
        []
      ),
      new GraphParameter('', {}),
      new Depth(2)
    );

    expect(stemQueryContext.getPathLiteral().get()).toBe(
      '(n0:User)-[r2:LIKES]->(n0:Item)'
    );
    expect(stemQueryContext.getMapEntries()).toStrictEqual([]);
  });

  test('N-:R-:N-R-N', () => {
    const ef = new ElementFixture();

    const stemQueryContext = new StemQueryContext(
      new Stem(
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
        null,
        []
      ),
      new GraphParameter('', {}),
      new Depth(2)
    );

    expect(stemQueryContext.getPathLiteral().get()).toBe(
      '(n0:User)-[r2:LIKES]->(n0:Item)<-[r2:HAS_STOCK]-(n0:Store)'
    );
    expect(stemQueryContext.getMapEntries()).toStrictEqual([
      ['user', 'n0{.*}'],
      ['hasStock', 'r2{.*}'],
      ['store', 'n0{.*}'],
    ]);
  });

  test('N-R-N with parameter', () => {
    const ef = new ElementFixture();

    const stemQueryContext = new StemQueryContext(
      new Stem(
        Path.new([
          ef.newNodeElement('User', 'user'),
          ef.newDirectionElement('-'),
          ef.newRelationshipElement('LIKES', 'likes'),
          ef.newDirectionElement('->'),
          ef.newNodeElement('Item', 'item'),
        ]),
        null,
        []
      ),
      new GraphParameter('', {
        user: { id: '1' },
        likes: { date: '2022-01-01' },
      }),
      new Depth(2)
    );

    expect(stemQueryContext.getPathLiteral().get()).toBe(
      '(n0:User{id:$user.id})-[r2:LIKES{date:$likes.date}]->(n0:Item)'
    );
    expect(stemQueryContext.getMapEntries()).toStrictEqual([
      ['user', 'n0{.*}'],
      ['likes', 'r2{.*}'],
      ['item', 'n0{.*}'],
    ]);
  });
});
