import {
  NodeEntity,
  Primary,
  Property,
  RelationshipEntity,
} from '../../../../../src';
import { hasNoDuplicateProperties } from '../../../../../src/metadata/schema/validation/hasNoDuplicateProperties';
import { validation } from '../../../../../src/metadata/schema/validation/validation';

describe('hasNoDuplicateProperties', () => {
  const validCases = [
    [
      () => {
        @NodeEntity('Node')
        class Node {
          @Primary()
          private a: string;

          @Property()
          private b: string;
        }
      },
    ],
    [
      () => {
        @RelationshipEntity('RELATIONSHIP')
        class Relationship {
          @Primary()
          private a: string;

          @Property()
          private b: string;
        }
      },
    ],
    [
      () => {
        @NodeEntity('Node')
        class Node {
          @Primary({ alias: 'b' })
          private a: string;

          @Property({ alias: 'a' })
          private b: string;
        }
      },
    ],
    [
      () => {
        @RelationshipEntity('RELATIONSHIP')
        class Relationship {
          @Primary({ alias: 'b' })
          private a: string;

          @Property({ alias: 'a' })
          private b: string;
        }
      },
    ],
  ];

  test.each(validCases)('valid definitions', (f: validation) => {
    expect(f).not.toThrowError();
  });

  const invalidCases = [
    [
      () => {
        @NodeEntity('Node')
        class Node {
          @Primary({ alias: 'dup' })
          private a: string;

          @Property()
          private dup: string;
        }
      },
      'Class "Node" has duplicate property name "dup".',
    ],
    [
      () => {
        @RelationshipEntity('RELATIONSHIP')
        class Relationship {
          @Primary({ alias: 'dup' })
          private a: string;

          @Property()
          private dup: string;
        }
      },
      'Class "Relationship" has duplicate property name "dup".',
    ],
    [
      () => {
        @NodeEntity('Node')
        class Node {
          @Primary({ alias: 'dup' })
          private a: string;

          @Property({ alias: 'dup' })
          private b: string;
        }
      },
      'Class "Node" has duplicate property name "dup".',
    ],
    [
      () => {
        @RelationshipEntity('RELATIONSHIP')
        class Relationship {
          @Primary({ alias: 'dup' })
          private a: string;

          @Property({ alias: 'dup' })
          private b: string;
        }
      },
      'Class "Relationship" has duplicate property name "dup".',
    ],
  ] as [validation, string][];

  test.each(invalidCases)(
    'invalid definitions',
    (f: validation, error: string) => {
      expect(f).toThrowError(error);
    }
  );
});
