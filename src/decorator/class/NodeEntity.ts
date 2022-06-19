interface NodeEntityOption {
  label?: string;
}

export function NodeEntity(option?: NodeEntityOption) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function _DecoratorName<T extends { new (...args: any[]): {} }>(
    constructor: T
  ) {};
}
