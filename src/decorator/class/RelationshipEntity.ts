interface RelationshipEntityOption {
  type?: string;
}

export function RelationshipEntity(
  option: RelationshipEntityOption | null = null
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function _DecoratorName<T extends { new (...args: any[]): {} }>(
    constructor: T
  ) {};
}
