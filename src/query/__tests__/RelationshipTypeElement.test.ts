import { RelationshipTypeTerm } from '../../domain/graph/pattern/formula/RelationshipTypeTerm';
import { RelationshipTypeElement } from '../element/RelationshipTypeElement';
import { PatternIndex } from '../../domain/graph/pattern/formula/PatternIndex';

describe('RelationshipTypeElement', () => {
  test.each([
    [':Rel', null],
    [':Rel@key', 'key'],
  ])('getGraphParameterKey', (value: string, key: string | null) => {
    const relationshipTypeTerm = new RelationshipTypeTerm(
      value,
      new PatternIndex(2)
    );

    const relationshipTypeElement = new RelationshipTypeElement(
      relationshipTypeTerm
    );
    expect(relationshipTypeElement.getGraphParameterKey()).toBe(key);
  });

  test.each([
    [':Rel', 'Rel'],
    [':Rel@key', 'Rel'],
  ])('getLabel', (value: string, type: string | null) => {
    const relationshipTypeTerm = new RelationshipTypeTerm(
      value,
      new PatternIndex(2)
    );

    const relationshipTypeElement = new RelationshipTypeElement(
      relationshipTypeTerm
    );
    expect(relationshipTypeElement.getType().toString()).toBe(type);
  });
});
