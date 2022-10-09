export function isBigInt(value: number) {
  if (value < 0) {
    return value < Number.MIN_SAFE_INTEGER;
  }
  return value > Number.MAX_SAFE_INTEGER;
}
