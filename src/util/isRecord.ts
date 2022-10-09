export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return (
    value !== null &&
    typeof value === 'object' &&
    value.constructor === Object &&
    {}.toString.call(value) === '[object Object]'
  );
};
