import { DeleteClause } from '../../clause/DeleteClause';

describe(`${DeleteClause.name}`, () => {
  test.each([
    ['v', true, 'DETACH DELETE v'],
    ['v', false, 'DELETE v'],
  ])('get', (variableName: string, detach: boolean, expected: string) => {
    expect(new DeleteClause(variableName, detach).get()).toBe(expected);
  });
});
